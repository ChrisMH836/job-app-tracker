import express from 'express';
import {
  createColumn,
  removeColumn,
  updateColumn,
} from '../controllers/columnControllers';

const router = express.Router();
router.post('/', createColumn);
router.delete('/:id', removeColumn);
router.put('/:id', updateColumn);

export default router;
