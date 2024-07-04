import { Router } from 'express'
import {
    deleteUser, 
    getUsers,
    updateUser,
    getUserById,
    signUp,
    login,
    verify2fa
 } from '../controllers/User.controller'

import { authenticateToken } from '../middleware/auth'

const router = Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/verify-2fa", verify2fa);
router.get("/users", authenticateToken, getUsers);
router.get("/user/:id", authenticateToken, getUserById);
router.delete("/deleteUser/:id", authenticateToken, deleteUser);
router.put("/updateUser/:id", authenticateToken, updateUser);

export default router