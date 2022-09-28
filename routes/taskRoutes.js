import {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  changeStatus,
} from '../controllers/taskController.js';
import checkAuth from '../middleware/checkAuth.js';
import express from 'express';

const router = express.Router();

router.post('/', checkAuth, addTask);
router
  .route('/:id')
  .get(checkAuth, getTask)
  .put(checkAuth, updateTask)
  .delete(checkAuth, deleteTask);

router.post('/status/:id', checkAuth, changeStatus);

export default router;
