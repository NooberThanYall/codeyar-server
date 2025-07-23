import { Router } from 'express';
const router = Router();
import authRoutes from './authRoutes.js'
import snippetRoutes from './snippetRoutes.js'
import userRoutes from './userRoutes.js'
import activityRoutes from './log/activityRoutes.js'
import planRoutes from './purchase/planRoutes.js'
import statRoutes from './app/statRoutes.js'

router.use('/auth', authRoutes);
router.use('/snippet', snippetRoutes);
router.use('/user', userRoutes);
router.use('/stats', statRoutes);
router.use('/plan', planRoutes);
router.use('/activity', activityRoutes);

export default router;