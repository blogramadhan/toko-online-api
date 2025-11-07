import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models';

interface JwtPayload {
    userId: number;
}

// Middleware untuk memverifikasi JWT token
const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token diperlukan'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        const user = await User.findByPk(decoded.userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof Error && error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
        }
        if (error instanceof Error && error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token telah expired'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Middleware untuk memverifikasi role admin
const requireAdmin = (req: Request, res: Response, next: NextFunction): any => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak. Hanya admin yang diizinkan.'
        });
    }
    next();
};

// Middleware untuk memverifikasi role user atau admin
const requireUser = (req: Request, res: Response, next: NextFunction): any => {
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak.'
        });
    }
    next();
};

export {
    authenticateToken,
    requireAdmin,
    requireUser
}; 