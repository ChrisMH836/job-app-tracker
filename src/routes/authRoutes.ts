import express from 'express';
import type { Router } from 'express';
import { login, logout, register } from '../controllers/authControllers';
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema, loginSchema } from '../validators/authValidators';

//create router
const router: Router = express.Router();

//define routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);
export default router;
