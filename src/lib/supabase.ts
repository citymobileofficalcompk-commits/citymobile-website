import { createClient as createSupabaseOriginalClient } from '@supabase/supabase-js';

// Original Supabase client configuration for Storage and Auth fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zqxjljjyzxlyewwlqyzu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxeGpsamp5enhseWV3d2xxeXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODIzNzksImV4cCI6MjA5NDE1ODM3OX0.raFh6twH470LUxZ8zj03GLFDvY25SBBuGk4KareBujg';

const isServer = typeof window === 'undefined';

const originalSupabase = createSupabaseOriginalClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: !isServer,
    autoRefreshToken: !isServer,
    detectSessionInUrl: !isServer,
  }
});

// Turso configuration
const tursoUrl = 'https://citymobile-db-citymobile.aws-ap-south-1.turso.io/v2/pipeline';
const tursoToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzkzMDE3NjUsImlkIjoiMDE5ZTQ2YTUtYzMwMS03NjMzLWE2ZDctN2MwZTQ4MjQ1NDcyIiwicmlkIjoiNTc4MmNmOGYtNjRkZC00MDQwLTg5YTMtZGVkNjBhZWI4NTFkIn0.f8ICSTUMsnHoFWaX69we3wPkka1GNJngT74nE_BUidDQJowWCPNHhp5q5uaYj1NsV4AOe9bg7PQ_t6g7EKDHDg';

async function queryTurso(sql: string, args: any[] = []) {
  const response = await fetch(tursoUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tursoToken}`
    },
    body: JSON.stringify({
      requests: [
        {
          type: 'execute',
          stmt: {
            sql,
            args: args.map(arg => {
              if (arg === null || arg === undefined) return { type: 'null' };
              if (typeof arg === 'number') {
                return Number.isInteger(arg) ? { type: 'integer', value: String(arg) } : { type: 'float', value: arg };
              }
              return { type: 'text', value: String(arg) };
            })
          }
        },
        {
          type: 'close'
        }
      ]
    })
  });
  
  const result = await response.json();
  if (result.results && result.results[0] && result.results[0].type === 'ok') {
    const resp = result.results[0].response;
    const cols = resp.result.cols.map((c: any) => c.name);
    const rows = resp.result.rows.map((row: any) => {
      const obj: any = {};
      row.forEach((cell: any, i: number) => {
        obj[cols[i]] = cell.value;
      });
      return obj;
    });
    return { rows };
  } else {
    throw new Error(result.results?.[0]?.error?.message || "Unknown Turso Error");
  }
}

function parseSQLiteRow(row: any) {
  if (!row) return row;
  const parsed = { ...row };
  
  if ('is_active' in parsed) {
    parsed.is_active = parsed.is_active === 1 || parsed.is_active === '1' || parsed.is_active === true;
  }
  if ('is_bestseller' in parsed) {
    parsed.is_bestseller = parsed.is_bestseller === 1 || parsed.is_bestseller === '1' || parsed.is_bestseller === true;
  }
  if ('is_premium' in parsed) {
    parsed.is_premium = parsed.is_premium === 1 || parsed.is_premium === '1' || parsed.is_premium === true;
  }
  
  const jsonCols = ['specs', 'highlights', 'features', 'images', 'product_ids'];
  for (const col of jsonCols) {
    if (col in parsed && typeof parsed[col] === 'string') {
      try {
        parsed[col] = JSON.parse(parsed[col]);
      } catch (e) {
        // Leave as is if JSON parsing failed
      }
    }
  }
  return parsed;
}

function prepareSQLiteValue(key: string, val: any) {
  if (val === null || val === undefined) {
    return null;
  }
  if (typeof val === 'boolean') {
    return val ? 1 : 0;
  }
  if (typeof val === 'object') {
    return JSON.stringify(val);
  }
  return val;
}

class TursoQueryBuilder {
  private table: string;
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private fields: string = '*';
  private insertRows: any[] = [];
  private updateData: any = null;
  private filters: any[] = [];
  private orderCol: string | null = null;
  private orderAsc: boolean = true;
  private limitVal: number | null = null;
  private isSingle: boolean = false;
  private isMaybeSingle: boolean = false;
  private countMode: string | null = null;
  private isHead: boolean = false;

  constructor(table: string) {
    this.table = table;
  }

  select(fields = '*', options?: { count?: string; head?: boolean }) {
    this.action = 'select';
    this.fields = fields;
    if (options) {
      if (options.count) this.countMode = options.count;
      if (options.head) this.isHead = options.head;
    }
    return this;
  }

  insert(values: any | any[]) {
    this.action = 'insert';
    this.insertRows = Array.isArray(values) ? values : [values];
    return this;
  }

  update(values: any) {
    this.action = 'update';
    this.updateData = values;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push({ type: 'eq', col, val });
    return this;
  }

  neq(col: string, val: any) {
    this.filters.push({ type: 'neq', col, val });
    return this;
  }

  ilike(col: string, val: any) {
    this.filters.push({ type: 'ilike', col, val });
    return this;
  }

  or(orString: string) {
    this.filters.push({ type: 'or', val: orString });
    return this;
  }

  not(col: string, op: string, val: any) {
    this.filters.push({ type: 'not', col, op, val });
    return this;
  }

  in(col: string, values: any[]) {
    this.filters.push({ type: 'in_filter', col, val: values });
    return this;
  }

  order(col: string, options?: { ascending?: boolean }) {
    this.orderCol = col;
    this.orderAsc = options?.ascending ?? true;
    return this;
  }

  limit(limit: number) {
    this.limitVal = limit;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const result = await this.execute();
      if (onfulfilled) return onfulfilled(result);
      return result;
    } catch (error) {
      if (onrejected) return onrejected(error);
      throw error;
    }
  }

  private buildWhereClause(): { whereClause: string; params: any[] } {
    const parts: string[] = [];
    const params: any[] = [];
    
    for (const filter of this.filters) {
      if (filter.type === 'eq') {
        parts.push(`${filter.col} = ?`);
        let val = filter.val;
        if (typeof val === 'boolean') val = val ? 1 : 0;
        params.push(val);
      } else if (filter.type === 'neq') {
        parts.push(`${filter.col} != ?`);
        let val = filter.val;
        if (typeof val === 'boolean') val = val ? 1 : 0;
        params.push(val);
      } else if (filter.type === 'ilike') {
        parts.push(`${filter.col} LIKE ?`);
        params.push(filter.val);
      } else if (filter.type === 'in_filter') {
        const items = filter.val;
        if (Array.isArray(items) && items.length > 0) {
          const placeholders = items.map(() => '?').join(', ');
          parts.push(`${filter.col} IN (${placeholders})`);
          params.push(...items);
        } else {
          parts.push('1 = 0'); // Ensure it fails/returns nothing if items is empty
        }
      } else if (filter.type === 'or') {
        const orParts: string[] = [];
        const subFilters = filter.val.split(',');
        for (const sub of subFilters) {
          const match = sub.match(/^([^.]+)\.([^.]+)\.(.+)$/);
          if (match) {
            const col = match[1];
            const op = match[2];
            let val = match[3];
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.slice(1, -1);
            }
            if (op === 'ilike' || op === 'like') {
              orParts.push(`${col} LIKE ?`);
              params.push(val);
            } else if (op === 'eq') {
              orParts.push(`${col} = ?`);
              params.push(val);
            }
          }
        }
        if (orParts.length > 0) {
          parts.push(`(${orParts.join(' OR ')})`);
        }
      } else if (filter.type === 'not') {
        if (filter.op === 'is' && filter.val === null) {
          parts.push(`${filter.col} IS NOT NULL`);
        } else if (filter.op === 'in') {
          let listStr = filter.val;
          if (listStr.startsWith('(') && listStr.endsWith(')')) {
            listStr = listStr.slice(1, -1);
          }
          const items = listStr.split(',').map((item: string) => {
            let s = item.trim();
            if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
            if (s.startsWith("'") && s.endsWith("'")) s = s.slice(1, -1);
            return s;
          });
          
          if (items.length > 0) {
            const placeholders = items.map(() => '?').join(', ');
            parts.push(`${filter.col} NOT IN (${placeholders})`);
            params.push(...items);
          }
        }
      }
    }
    
    return {
      whereClause: parts.join(' AND '),
      params
    };
  }

  private async execute() {
    try {
      if (this.action === 'select') {
        let sql = '';
        const params: any[] = [];
        
        if (this.isHead) {
          sql = `SELECT COUNT(*) as count FROM ${this.table}`;
        } else {
          sql = `SELECT * FROM ${this.table}`;
        }
        
        const { whereClause, params: whereParams } = this.buildWhereClause();
        if (whereClause) {
          sql += ` WHERE ${whereClause}`;
          params.push(...whereParams);
        }
        
        if (!this.isHead) {
          if (this.orderCol) {
            sql += ` ORDER BY ${this.orderCol} ${this.orderAsc ? 'ASC' : 'DESC'}`;
          }
          if (this.limitVal !== null) {
            sql += ` LIMIT ${this.limitVal}`;
          }
        }
        
        const response = await queryTurso(sql, params);
        
        if (this.isHead) {
          const count = response.rows[0]?.count ?? 0;
          return { data: null, error: null, count: Number(count) };
        }
        
        const data = response.rows.map((row: any) => parseSQLiteRow(row));
        
        if (this.isSingle) {
          if (data.length === 0) {
            return { data: null, error: { message: 'Row not found' } };
          }
          return { data: data[0], error: null };
        }
        
        if (this.isMaybeSingle) {
          if (data.length === 0) {
            return { data: null, error: null };
          }
          return { data: data[0], error: null };
        }
        
        return { data, error: null };
      }
      
      if (this.action === 'insert') {
        const results: any[] = [];
        for (const row of this.insertRows) {
          const cols: string[] = [];
          const placeholders: string[] = [];
          const params: any[] = [];
          
          for (const [k, v] of Object.entries(row)) {
            cols.push(k);
            placeholders.push('?');
            params.push(prepareSQLiteValue(k, v));
          }
          
          const sql = `INSERT INTO ${this.table} (${cols.join(', ')}) VALUES (${placeholders.join(', ')});`;
          await queryTurso(sql, params);
          results.push(parseSQLiteRow(row));
        }
        return { data: results, error: null };
      }
      
      if (this.action === 'update') {
        const sets: string[] = [];
        const params: any[] = [];
        
        for (const [k, v] of Object.entries(this.updateData)) {
          sets.push(`${k} = ?`);
          params.push(prepareSQLiteValue(k, v));
        }
        
        let sql = `UPDATE ${this.table} SET ${sets.join(', ')}`;
        const { whereClause, params: whereParams } = this.buildWhereClause();
        if (whereClause) {
          sql += ` WHERE ${whereClause}`;
          params.push(...whereParams);
        }
        
        await queryTurso(sql, params);
        return { data: this.updateData, error: null };
      }
      
      if (this.action === 'delete') {
        let sql = `DELETE FROM ${this.table}`;
        const params: any[] = [];
        const { whereClause, params: whereParams } = this.buildWhereClause();
        if (whereClause) {
          sql += ` WHERE ${whereClause}`;
          params.push(...whereParams);
        }
        
        await queryTurso(sql, params);
        return { data: null, error: null };
      }
      
      throw new Error(`Unsupported action: ${this.action}`);
    } catch (error: any) {
      console.error(`Turso execution error on ${this.table}:`, error);
      return { data: null, error: { message: error.message || String(error) } };
    }
  }
}

export const supabase = {
  from(table: string) {
    return new TursoQueryBuilder(table);
  },
  get storage() {
    return originalSupabase.storage;
  },
  get auth() {
    return originalSupabase.auth;
  }
};
