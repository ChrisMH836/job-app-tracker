import express from 'express';
import { createJobItem } from '../controllers/jobItemControllers';

const router = express.Router();
router.post('/', createJobItem);

export default router;
