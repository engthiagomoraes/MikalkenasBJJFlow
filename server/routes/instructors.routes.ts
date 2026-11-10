import { Router } from 'express';
import { InstructorsController } from '../controllers/instructorsController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Listagem de professores (aberta a autenticados, mas mascara PIX/banco para alunos)
router.get('/', authenticateToken, InstructorsController.listInstructors);

// Cadastro de professor (exclusivo para administradores)
router.post('/', requireAdmin, InstructorsController.createInstructor);

// Atualização de professor (exclusivo para administradores)
router.put('/:id', requireAdmin, InstructorsController.updateInstructor);

// Exclusão de professor com proteção de integridade (exclusivo para administradores)
router.delete('/:id', requireAdmin, InstructorsController.deleteInstructor);

export default router;
