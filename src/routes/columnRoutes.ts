import express from 'express';
import {
  createColumn,
  removeColumn,
  updateColumn,
} from '../controllers/columnControllers';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();
router.use(authMiddleware);
router.post('/', createColumn);
router.delete('/:id', removeColumn);
router.put('/:id', updateColumn);

export default router;
