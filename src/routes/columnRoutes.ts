import express from 'express';
import { createColumn } from '../controllers/columnControllers';

const router = express.Router();
router.post('/', createColumn);

export default router;
