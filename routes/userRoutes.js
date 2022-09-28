import express from 'express';
const router = express.Router();
import {
  createUser,
  authenticate,
  confirm,
  forgotPassword,
  checksPassword,
  newPassword,
  profile,
} from '../controllers/userController.js';
import checkAuth from '../middleware/checkAuth.js';

// authentication, registration and confirmation of users
router.post('/createUser', createUser);
router.post('/login', authenticate);
router.get('/confirm/:token', confirm);
router.post('/forgot-password', forgotPassword);
router.get('/forgot-password/:token', checksPassword);
router.post('/forgot-password/:token', newPassword);

router.get('/profile', checkAuth, profile);

export default router;
