"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = require("../models/Admin");
const requireAdminAuth = async (req, res, next) => {
    try {
        let token;
        // 1. Check HTTP-only Cookie
        if (req.headers.cookie) {
            const cookies = req.headers.cookie.split(';').reduce((acc, current) => {
                const [key, value] = current.trim().split('=');
                acc[key] = value;
                return acc;
            }, {});
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
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const adminUser = await Admin_1.Admin.findById(decoded.id);
        if (!adminUser) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Account no longer exists.' });
        }
        req.admin = {
            id: adminUser._id.toString(),
            email: adminUser.email,
            role: adminUser.role,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token.' });
    }
};
exports.requireAdminAuth = requireAdminAuth;
