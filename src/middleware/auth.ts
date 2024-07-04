import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { code } from '../utils/HttpCodes';

const JWT_SECRET = process.env.JWT_SECRET || '';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {

    const token = req.headers['authorization'];

    if (!token) {
        return res.status(code.UNAUTHORIZED).json({ 
            message: 'Access denied. No token provided.'
        });
    }

    try {
        jwt.verify(token, JWT_SECRET) as JwtPayload;
        next();
    } catch (err) {

        res.status(code.FORBIDDEN).json({ 
            message: 'Invalid token.' 
        });

    }
}
