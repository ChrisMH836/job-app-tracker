import express from 'express';
import {
  createJobItem,
  getJobItem,
  removeJobItem,
  updateJobItem,
} from '../controllers/jobItemControllers';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createJobItemSchema,
  removeJobItemSchema,
  updateJobItemSchema,
} from '../validators/jobItemValidators';

const router = express.Router();
router.use(authMiddleware);

router.post('/', validateRequest(createJobItemSchema), createJobItem);
router.get('/:id', getJobItem);
router.delete('/:id', removeJobItem);
router.put('/:id', validateRequest(updateJobItemSchema), updateJobItem);

export default router;
