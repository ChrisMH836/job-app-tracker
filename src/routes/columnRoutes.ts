import express from 'express';
import {
  createColumn,
  getColumn,
  getColumns,
  removeColumn,
  updateColumn,
} from '../controllers/columnControllers';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createColumnSchema,
  updateColumnSchema,
} from '../validators/columnValidators';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getColumns);
router.get('/:id', getColumn);
router.post('/', validateRequest(createColumnSchema), createColumn);
router.delete('/:id', removeColumn);
router.put('/:id', validateRequest(updateColumnSchema), updateColumn);

export default router;
