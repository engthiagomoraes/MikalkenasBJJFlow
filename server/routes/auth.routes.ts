import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Rotas públicas de autenticação e recuperação
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/recover-password', AuthController.recoverPassword);

// Rotas de verificação de sessão e troca de senha protegidas por Bearer
router.get('/me', authenticateToken, AuthController.me);
router.post('/change-password', authenticateToken, AuthController.changePassword);

export default router;


