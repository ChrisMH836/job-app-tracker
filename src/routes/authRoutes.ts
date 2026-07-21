import express from 'express';
import type { Router } from 'express';
import register from '../controllers/authControllers';

//create router
const router: Router = express.Router();

//define routes
router.post('/register', register);
export default router;
