import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Rotas públicas (com rate limit no controller)
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/forgot-password', AuthController.recoverPassword);
router.post('/recover-password', AuthController.recoverPassword); // alias legado
router.post('/reset-password', AuthController.resetPassword);

// Rotas protegidas por Bearer
router.get('/me', authenticateToken, AuthController.me);
router.post('/change-password', authenticateToken, AuthController.changePassword);

export default router;
