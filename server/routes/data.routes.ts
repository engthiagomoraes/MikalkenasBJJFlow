import { Router } from 'express';
import { DataController } from '../controllers/dataController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Todas as rotas exigem sessão válida; o escopo por papel é aplicado no controller.
router.get('/:table', authenticateToken, DataController.list);
router.post('/:table/upsert', authenticateToken, DataController.upsert);
router.patch('/:table/:id', authenticateToken, DataController.update);
router.delete('/:table/:id', authenticateToken, DataController.remove);

export default router;
