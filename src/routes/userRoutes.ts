import express from 'express';
import {
  deleteMe,
  getMe,
  updateMe,
  updatePassword,
} from '../controllers/userControllers';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  updateMeSchema,
  updatePasswordSchema,
} from '../validators/userValidators';

const router = express.Router();

router.use(authMiddleware);
router.get('/me', getMe);
router.delete('/me', deleteMe);
router.put('/me', validateRequest(updateMeSchema), updateMe);
router.put(
  '/me/password',
  validateRequest(updatePasswordSchema),
  updatePassword,
);

export default router;
