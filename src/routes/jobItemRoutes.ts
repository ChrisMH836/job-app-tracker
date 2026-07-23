import express from 'express';
import {
  createJobItem,
  removeJobItem,
} from '../controllers/jobItemControllers';

const router = express.Router();
router.post('/', createJobItem);
router.delete('/:id', removeJobItem);

export default router;
