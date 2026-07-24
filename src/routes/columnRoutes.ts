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
  removeColumnSchema,
  updateColumnSchema,
} from '../validators/columnValidators';

const router = express.Router();
router.use(authMiddleware);
router.post('/', validateRequest(createColumnSchema), createColumn);
router.delete('/:id', validateRequest(removeColumnSchema), removeColumn);
router.put('/:id', validateRequest(updateColumnSchema), updateColumn);

export default router;
