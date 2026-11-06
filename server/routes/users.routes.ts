import { Router } from 'express';
import { UsersController } from '../controllers/usersController';
import {
  requireAdmin,
  requireMasterAdmin
} from '../middleware/authMiddleware';

const router = Router();

// Gestão operacional permitida a administradores comuns e master.
router.get('/', requireAdmin, UsersController.listUsers);
router.post('/:id/approve', requireAdmin, UsersController.approveUser);
router.post('/:id/reject', requireAdmin, UsersController.rejectUser);

// Mudanças de papel e reconciliação exigem administrador master.
// A reconciliação pode alterar vínculos de múltiplos usuários.
router.patch('/:id/role', requireMasterAdmin, UsersController.updateRole);
router.post('/reconcile', requireMasterAdmin, UsersController.reconcileUsers);

export default router;