import { createClient } from '@libsql/client';

const databaseUrl = import.meta.env.VITE_TURSO_DATABASE_URL || 'libsql://citymobile-db-citymobile.aws-ap-south-1.turso.io';
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN || '';

// Translate libsql protocol to https for web/browser environment compatibility
const cleanUrl = databaseUrl.replace(/^libsql:\/\//, 'https://');

export const db = createClient({
  url: cleanUrl,
  authToken
});

export function parseSQLiteRow(row: any) {
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
        // Fallback for default array representation if parsing failed
      }
    }
  }
  return parsed;
}

export function prepareSQLiteValue(key: string, val: any) {
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

export async function query<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  const result = await db.execute({ sql, args: args.map(arg => prepareSQLiteValue('', arg)) });
  return result.rows.map(row => parseSQLiteRow(row)) as T[];
}

export async function querySingle<T = any>(sql: string, args: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, args);
  return rows.length > 0 ? rows[0] : null;
}

export async function countRows(sql: string, args: any[] = []): Promise<number> {
  const result = await db.execute({ sql, args: args.map(arg => prepareSQLiteValue('', arg)) });
  const row = result.rows[0];
  if (!row) return 0;
  const val = Object.values(row)[0];
  return Number(val ?? 0);
}

export async function insertRow(table: string, row: any) {
  const cols = [];
  const placeholders = [];
  const params = [];
  
  for (const [k, v] of Object.entries(row)) {
    cols.push(k);
    placeholders.push('?');
    params.push(v);
  }
  
  const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders.join(', ')})`;
  await query(sql, params);
}

export async function updateRow(table: string, id: string, updates: any) {
  const sets = [];
  const params = [];
  
  for (const [k, v] of Object.entries(updates)) {
    sets.push(`${k} = ?`);
    params.push(v);
  }
  
  const sql = `UPDATE ${table} SET ${sets.join(', ')} WHERE id = ?`;
  params.push(id);
  await query(sql, params);
}

export async function deleteRow(table: string, id: string) {
  const sql = `DELETE FROM ${table} WHERE id = ?`;
  await query(sql, [id]);
}
