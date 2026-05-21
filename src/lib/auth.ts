import { querySingle } from './turso';
import bcrypt from 'bcryptjs';

export const auth = {
  async getUser() {
    if (typeof window === 'undefined') return { data: { user: null } };
    const token = localStorage.getItem('cm-admin-token');
    if (!token) return { data: { user: null } };
    try {
      const [payloadStr, signature] = token.split('.');
      if (!payloadStr || !signature) {
        return { data: { user: null } };
      }
      // Verify signature to prevent tampering
      const expectedSignature = btoa(payloadStr + '_citymobile_secret');
      if (signature !== expectedSignature) {
        return { data: { user: null } };
      }
      const payload = JSON.parse(atob(payloadStr));
      if (payload.exp && payload.exp < Date.now()) {
        localStorage.removeItem('cm-admin-token');
        return { data: { user: null } };
      }
      return { data: { user: { email: payload.email } } };
    } catch (e) {
      return { data: { user: null } };
    }
  },
  
  async signInWithPassword({ email, password }: any) {
    try {
      const admin = await querySingle('SELECT * FROM admins WHERE email = ?', [email]);
      if (!admin) {
        return { data: null, error: { message: 'Invalid email or password' } };
      }
      
      const passwordMatch = bcrypt.compareSync(password, admin.password_hash);
      if (!passwordMatch) {
        return { data: null, error: { message: 'Invalid email or password' } };
      }
      
      const payload = {
        email: admin.email,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 1 day
      };
      const payloadStr = btoa(JSON.stringify(payload));
      const signature = btoa(payloadStr + '_citymobile_secret');
      const token = `${payloadStr}.${signature}`;
      
      localStorage.setItem('cm-admin-token', token);
      return { data: { user: { email } }, error: null };
    } catch (err: any) {
      console.error('Auth error:', err);
      return { data: null, error: { message: err.message || 'An error occurred during authentication' } };
    }
  },
  
  async signOut() {
    localStorage.removeItem('cm-admin-token');
    return { error: null };
  }
};

