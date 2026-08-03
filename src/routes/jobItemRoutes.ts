import express from 'express';
import {
  createJobItem,
  getJobItem,
  removeJobItem,
  updateJobItem,
} from '../controllers/jobItemControllers';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  validateParams,
  validateRequest,
} from '../middlewares/validateRequest';
import {
  createJobItemSchema,
  removeJobItemSchema,
  updateJobItemSchema,
} from '../validators/jobItemValidators';
import { idParamSchema } from '../validators/paramValidators';

const router = express.Router();
router.use(authMiddleware);

router.post('/', validateRequest(createJobItemSchema), createJobItem);
router.get('/:id', validateParams(idParamSchema), getJobItem);
router.delete('/:id', removeJobItem);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validateRequest(updateJobItemSchema),
  updateJobItem,
);

export default router;
