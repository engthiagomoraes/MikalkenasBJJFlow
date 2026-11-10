import { Router } from 'express';
import { UsersController } from '../controllers/usersController';
import {
  authenticateToken,
  requireAdmin,
  requireMasterAdmin
} from '../middleware/authMiddleware';

const router = Router();

// Dados próprios (lista branca: nome, telefone) — declarado antes de '/:id'
router.patch('/me', authenticateToken, UsersController.updateMe);

// Gestão operacional permitida a administradores comuns e master.
router.get('/', requireAdmin, UsersController.listUsers);
router.post('/:id/approve', requireAdmin, UsersController.approveUser);
router.post('/:id/reject', requireAdmin, UsersController.rejectUser);
router.patch('/:id', requireAdmin, UsersController.adminUpdateUser);
router.post('/:id/reset-password', requireAdmin, UsersController.adminResetPassword);

// Mudanças de papel e reconciliação exigem administrador master (consultado no banco).
router.patch('/:id/role', requireMasterAdmin, UsersController.updateRole);
router.post('/reconcile', requireMasterAdmin, UsersController.reconcileUsers);

export default router;
