import { Router } from 'express';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import systemRoutes from './routes/system.routes';
import attendanceRoutes from './routes/attendance.routes';
import instructorsRoutes from './routes/instructors.routes';
import studentsRoutes from './routes/students.routes';
import dataRoutes from './routes/data.routes';

const serverRouter = Router();

// Subrotas da API do Backend
serverRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Mikalkenas Jiu Jitsu API' });
});

serverRouter.use('/auth', authRoutes);
serverRouter.use('/users', usersRoutes);
serverRouter.use('/system', systemRoutes);
serverRouter.use('/attendance', attendanceRoutes);
serverRouter.use('/instructors', instructorsRoutes);
serverRouter.use('/students', studentsRoutes);
serverRouter.use('/data', dataRoutes);

export default serverRouter;
