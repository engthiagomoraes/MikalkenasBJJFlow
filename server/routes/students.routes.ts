import { Router } from 'express';
import { StudentsController } from '../controllers/studentsController';
import { authenticateToken, requireInstructorOrAdmin, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Consulta de alunos com escopo de permissão (aluno -> self, professor -> seus alunos, admin -> todos)
router.get('/', authenticateToken, StudentsController.listStudents);

// Cadastro de aluno (exige professor ou administrador)
router.post('/', requireInstructorOrAdmin, StudentsController.createStudent);

// Atualização de aluno (exige professor ou administrador)
router.put('/:id', requireInstructorOrAdmin, StudentsController.updateStudent);

// Exclusão de aluno (exclusivo para administrador)
router.delete('/:id', requireAdmin, StudentsController.deleteStudent);

export default router;
