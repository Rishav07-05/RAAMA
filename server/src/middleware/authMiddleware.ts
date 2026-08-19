import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

export const requireAdminAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // 1. Check HTTP-only Cookie
    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').reduce((acc, current) => {
        const [key, value] = current.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      token = cookies['jwt_admin'];
    }

    // 2. Fallback to Authorization Header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Admin authentication required.' });
    }

    const secret = process.env.JWT_SECRET || 'raama_super_secret_jwt_key_2026_production';
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };

    const adminUser = await Admin.findById(decoded.id);
    if (!adminUser) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Account no longer exists.' });
    }

    req.admin = {
      id: adminUser._id.toString(),
      email: adminUser.email,
      role: adminUser.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token.' });
  }
};
