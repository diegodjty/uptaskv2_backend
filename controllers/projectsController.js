import verifyOwner from '../helpers/verifyOwner.js';
import Projects from '../models/Projects.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

const getProjects = async (req, res) => {
  const projects = await Projects.find({
    $or: [{ collaborators: { $in: req.user } }, { creator: { $in: req.user } }],
  }).select('-tasks');

  res.json(projects);
};

const newProject = async (req, res) => {
  const project = new Projects(req.body);
  project.creator = req.user._id;

  try {
    const savedProject = await project.save();
    res.json(savedProject);
  } catch (error) {
    console.log(error);
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;

  const project = await Projects.findById(id)
    .populate({
      path: 'tasks',
      populate: { path: 'completed', select: 'name' },
    })
    .populate('collaborators', 'name email ');

  verifyOwner(project, req, res);

  res.json(project);
};

const editProject = async (req, res) => {
  const { id } = req.params;

  const project = await Projects.findById(id);

  verifyOwner(project, req, res);

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.dueDate = req.body.dueDate || project.dueDate;
  project.client = req.body.client || project.client;

  try {
    const savedProject = await project.save();
    res.json(savedProject);
  } catch (error) {
    console.log(error);
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  const project = await Projects.findById(id);
  verifyOwner(project, req, res);

  try {
    await project.deleteOne();
    res.json({ msg: 'Project Eliminated' });
  } catch (error) {
    console.log(error);
  }
};

const addCollaborator = async (req, res) => {
  const project = await Projects.findById(req.params.id);

  if (!project) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }
  console.log(project.creator.toString(), '---', req.user._id.toString());
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Not Valid Action');
    return res.status(404).json({ msg: error.message });
  }
  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    '-confirmed -createdAt -password -token -updatedAt -__v '
  );

  if (!user) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() === user._id.toString()) {
    const error = new Error('Project Creator Cant be a Collaborator');
    return res.status(404).json({ msg: error.message });
  }

  if (project.collaborators.includes(user._id)) {
    const error = new Error('User is already part of the project');
    return res.status(404).json({ msg: error.message });
  }

  project.collaborators.push(user._id);
  await project.save();
  res.json({ msg: 'Colaborator added succesfully' });
};

const deleteCollaborator = async (req, res) => {
  const project = await Projects.findById(req.params.id);

  if (!project) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Not Valid Action');
    return res.status(404).json({ msg: error.message });
  }

  project.collaborators.pull(req.body.id);
  await project.save();
  res.json({ msg: 'Colaborator Deleted Succesfully' });
};

const searchCollaborator = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    '-confirmed -createdAt -password -token -updatedAt -__v '
  );

  if (!user) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }
  res.json(user);
};

const getTasks = async (req, res) => {
  const { id } = req.params;

  const projectExist = await Projects.findById(id);
  if (!projectExist) {
    const error = new Error('Not found');
    return res.status(400).json({ msg: error.message });
  }

  const tasks = await Task.find().where('project').equals(id);

  res.json(tasks);
};

export {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  getTasks,
  searchCollaborator,
};
