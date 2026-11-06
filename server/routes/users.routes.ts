import { Router } from 'express';
import { UsersController } from '../controllers/usersController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Todas as operações de gestão de usuários são estritamente restritas a administradores autenticados via Bearer Token
router.get('/', requireAdmin, UsersController.listUsers);
router.post('/reconcile', requireAdmin, UsersController.reconcileUsers);
router.post('/:id/approve', requireAdmin, UsersController.approveUser);
router.post('/:id/reject', requireAdmin, UsersController.rejectUser);
router.patch('/:id/role', requireAdmin, UsersController.updateRole);

export default router;
