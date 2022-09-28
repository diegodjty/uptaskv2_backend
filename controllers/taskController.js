import Project from '../models/Projects.js';
import Task from '../models/Task.js';
const addTask = async (req, res) => {
  const { project } = req.body;

  const projectExist = await Project.findById(project);

  if (!projectExist) {
    const error = new Error('Project dosnt exist');
    return res.status(404).json({ msg: error.message });
  }

  if (projectExist.creator.toString() !== req.user._id.toString()) {
    const error = new Error("You can' Add a task");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const savedTask = await Task.create(req.body);
    projectExist.tasks.push(savedTask._id);
    await projectExist.save();
    return res.json(savedTask);
  } catch (error) {
    console.log(error);
  }
};
const getTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id).populate('projects');

  if (!task) {
    const error = new Error('Task not found');
    return res.status(404).json({ msg: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("You can' Add a task");
    return res.status(403).json({ msg: error.message });
  }
  res.json(task);
};
const updateTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    const error = new Error('Task not found');
    return res.status(404).json({ msg: error.message });
  }

  const savedProject = await Project.findById(task.project);

  if (savedProject.creator.toString() !== req.user._id.toString()) {
    const error = new Error("You can' Add a task");
    return res.status(403).json({ msg: error.message });
  }

  task.name = req.body.name || task.name;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.dueDate = req.body.dueDate || task.dueDate;

  try {
    const savedTask = await task.save();
    res.json(savedTask);
  } catch (error) {
    console.log(error);
  }
};
const deleteTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id).populate('project');

  if (!task) {
    const error = new Error('Task not found');
    return res.status(404).json({ msg: error.message });
  }

  const savedProject = await Project.findById(task.project);

  if (savedProject.creator.toString() !== req.user._id.toString()) {
    const error = new Error("You can' Add a task");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const project = await Project.findById(task.project);

    project.tasks.pull(task._id);

    await Promise.allSettled([await project.save(), await task.deleteOne()]);
    res.json({ msg: 'Task Deleted' });
  } catch (error) {
    console.log(error);
  }
};
const changeStatus = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id).populate('project');

  if (!task) {
    const error = new Error('Task not found');
    return res.status(404).json({ msg: error.message });
  }

  if (
    task.project.creator.toString() !== req.user._id.toString() &&
    !task.project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error('Not Valid Action');
    return res.status(403).json({ msg: error.message });
  }

  task.status = !task.status;
  task.completed = req.user._id;
  await task.save();
  const savedTask = await Task.findById(id)
    .populate('project')
    .populate('completed');
  res.json(savedTask);
};

export { addTask, getTask, updateTask, deleteTask, changeStatus };
