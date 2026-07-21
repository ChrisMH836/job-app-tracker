import express from 'express';
import type { Router } from 'express';
import { login, logout, register } from '../controllers/authControllers';

//create router
const router: Router = express.Router();

//define routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
export default router;
