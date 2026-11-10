import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { authenticateToken, requireInstructorOrAdmin } from '../middleware/authMiddleware';

const router = Router();

// Consulta com filtros no servidor por data/período e aluno, com escopo por papel
router.get('/', authenticateToken, AttendanceController.listAttendance);

// Registro de presença (exige professor ou administrador)
router.post('/', requireInstructorOrAdmin, AttendanceController.createAttendance);

// Exclusão de registro de presença (exige professor ou administrador)
router.delete('/:id', requireInstructorOrAdmin, AttendanceController.deleteAttendance);

export default router;
