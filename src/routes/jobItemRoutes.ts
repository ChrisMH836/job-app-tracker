import express from 'express';
import {
  createJobItem,
  removeJobItem,
  updateJobItem,
} from '../controllers/jobItemControllers';

const router = express.Router();
router.post('/', createJobItem);
router.delete('/:id', removeJobItem);
router.put('/:id', updateJobItem);

export default router;
