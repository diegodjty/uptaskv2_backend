const verifyOwner = (project, req, res) => {
  if (!project) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }

  if (
    project.creator.toString() !== req.user._id.toString() &&
    !project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error('Invalid action');
    return res.status(401).json({ msg: error.message });
  }
};

export default verifyOwner;
