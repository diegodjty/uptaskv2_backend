import express from 'express';
import {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  getTasks,
  searchCollaborator,
} from '../controllers/projectsController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, getProjects);
router.post('/', checkAuth, newProject);

router.get('/:id', checkAuth, getProject);
router.put('/:id', checkAuth, editProject);
router.delete('/:id', checkAuth, deleteProject);

router.get('/task/:id', checkAuth, getTasks);
router.post('/collaborator', checkAuth, searchCollaborator);
router.post('/collaborator/:id', checkAuth, addCollaborator);
router.post('/delete-collaborator/:id', checkAuth, deleteCollaborator);

export default router;
