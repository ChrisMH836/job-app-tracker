import express from 'express';
import {
  createColumn,
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
router.post('/', validateRequest(createColumnSchema), createColumn);
router.delete('/:id', removeColumn);
router.put('/:id', validateRequest(updateColumnSchema), updateColumn);

export default router;
