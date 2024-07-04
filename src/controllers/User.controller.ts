import { Request, Response } from "express"
import { prisma } from "../lib/prisma"
import { code } from "../utils/HttpCodes";
import bcrypt from 'bcryptjs';
import { authenticateUser, verifyTwoFactorCode } from "../helpers/authService";

export const getUsers = async (req: Request, res: Response) => {

    try {
        const page = parseInt(req?.query?.page as string) || 1;
        const pageSize = parseInt(req?.query?.pageSize as string) || 10;

        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const totalUsers = await prisma.user.count();
        const users = await prisma.user.findMany({
            skip,
            take,
        });

        const data = users.map(user => {
            const { password, twoFactorCode, twoFactorCodeExpires, ...restData } = user;
            return {
                ...restData
            }
        })

        res.status(code.OK).json({
            page,
            pageSize,
            totalUsers,
            totalPages: Math.ceil(totalUsers / pageSize),
            users: data,
        });
    } catch (error) {
        res.status(code.INTERNAL_SERVER_ERROR).json({
            error,
        });
    }

}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })

        res.status(code.OK).json({
            user
        })
    } catch (error) {
        res.status(code.INTERNAL_SERVER_ERROR).json({
            error
        })
    }
}

export const signUp = async (req: Request, res: Response) => {
    const { password: pass, ...restBody } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(pass, 10);

        const newUser = await prisma.user.create({
            data: {
                ...restBody,
                password: hashedPassword
            }
        });

        const { password, twoFactorCode, twoFactorCodeExpires, ...restData } = newUser;

        res.status(code.CREATED).json({
            userCreated: restData
        })

    } catch (error) {
        res.status(code.INTERNAL_SERVER_ERROR).json({
            error
        })
    }
}

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    try {
        const response = await authenticateUser(email, password);

        res.status(code.OK).json({
            response
        })

    } catch (error) {
        res.status(code.INTERNAL_SERVER_ERROR).json({
            error
        })
    }

}

export const deleteUser = async (req: Request, res: Response) => {

    try {
        const idUser = await prisma.user.delete({
            where: {
                id: +req.params.id
            }
        });

        res.status(code.OK).json({
            info: idUser
        })

    } catch (error) {
        res.status(code.INTERNAL_SERVER_ERROR).json({
            error
        })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: +req.params.id
            },
            data: req.body
        })

        res.status(code.OK).json({
            updatedUser
        })

    } catch (error) {
        res.status(code.INTERNAL_SERVER_ERROR).json({
            error
        })
    }
}

export const verify2fa = async (req: Request, res: Response) => {

    const { userId, code: cod } = req.body;

    try {
        const response = await verifyTwoFactorCode(userId, cod);

        res.status(code.OK).json({
            response
        })

    } catch (error) {
        res.status(code.INTERNAL_SERVER_ERROR).json({
            error
        })
    }
}
