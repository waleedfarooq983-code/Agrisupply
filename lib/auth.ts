import jwt from 'jsonwebtoken';

const SECRET = 'agrisupply-demo-secret';

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
}

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, SECRET) as JWTPayload;
  } catch {
    return null;
  }
}