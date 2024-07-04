
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import dotenv from 'dotenv';
import { SendSmtpEmail } from '@getbrevo/brevo'
import { gethtml } from '../template/code2fa';
import { sendEmail } from '../email';

const JWT_SECRET = process?.env?.JWT_SECRET || "";
const MAIL_SERVER = process?.env?.MAIL_SERVER || "";
const NAME_SERVER = process?.env?.NAME_SERVER || "";
const JWT_EXPIRES_IN = '12h';

dotenv.config();

// Generar un código 2FA aleatorio
const getCode = () : string => {
    const numRandm = Math.floor(Math.random() * 100000);
    const numWithZero = numRandm.toString().padStart(5, '0');
    return numWithZero;
}

// Iniciar sesión y enviar el código 2FA
export async function authenticateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !await bcrypt.compare(password, user.password)) {
        throw new Error('Invalid email or password');
    }

    // Guardar el código 2FA
    const twoFactorCode = getCode();
    const twoFactorCodeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos de validez

    await prisma.user.update({
        where: { id: user.id },
        data: {
            twoFactorCode,
            twoFactorCodeExpires,
        }
    });

    // Enviar el código 2FA al correo del usuario
    const sendEmailSmtp = new SendSmtpEmail()
    sendEmailSmtp.subject = "[Auth] Código de verificación!!";
    sendEmailSmtp.to =[{ email: user.email }]
    sendEmailSmtp.htmlContent = gethtml(twoFactorCode, "System Auth")
    sendEmailSmtp.sender = {
        name: NAME_SERVER,
        email: MAIL_SERVER
    };

    await sendEmail(sendEmailSmtp);

    return {
        message: '2FA code sent to your email',
        userId: user.id,
        result: true
    };
}

// Verificar el código 2FA y generar un JWT
export async function verifyTwoFactorCode(userId: number, code: string) {
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const expiration = new Date(user?.twoFactorCodeExpires!);
    
    if (!user || user.twoFactorCode !== code || new Date() > expiration) {
        return {
            message: 'Authentication successful',
            error: 'Invalid or expired 2FA code',
            token: null,
        }
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            twoFactorCode: null,
            twoFactorCodeExpires: null,
        },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
        message: 'Authentication successful',
        token,
    };
}
