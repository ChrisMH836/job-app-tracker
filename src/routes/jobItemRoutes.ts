import express from 'express';
import {
  createJobItem,
  removeJobItem,
  updateJobItem,
} from '../controllers/jobItemControllers';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();
router.use(authMiddleware);
router.post('/', createJobItem);
router.delete('/:id', removeJobItem);
router.put('/:id', updateJobItem);

export default router;
