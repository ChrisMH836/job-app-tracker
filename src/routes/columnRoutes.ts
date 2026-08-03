import express from 'express';
import {
  createColumn,
  getColumn,
  getColumns,
  removeColumn,
  updateColumn,
} from '../controllers/columnControllers';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  validateParams,
  validateRequest,
} from '../middlewares/validateRequest';
import {
  createColumnSchema,
  updateColumnSchema,
} from '../validators/columnValidators';
import { idParamSchema } from '../validators/paramValidators';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getColumns);
router.get('/:id', validateParams(idParamSchema), getColumn);
router.post('/', validateRequest(createColumnSchema), createColumn);
router.delete('/:id', validateParams(idParamSchema), removeColumn);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validateRequest(updateColumnSchema),
  updateColumn,
);

export default router;
