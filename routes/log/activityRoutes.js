import { Router } from 'express';
import authMiddleware from './../../middleware/AuthMiddleware.js';
import { Activity } from '../../models/logs/ActivityModel.js';
const router = Router();

router.post('/', authMiddleware, async (req, res, _) => {
   try {
      const {loggedData} = req.body;

      await Activity.create({
         ...loggedData
      });

      res.status(200)
   } catch (error) {
      res.status(500)
   }
})

export default router;
