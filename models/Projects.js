import mongoose from 'mongoose';

const projectsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
    },
    description: {
      type: String,
      trim: true,
      require: true,
    },
    dueDate: {
      type: Date,
      default: Date.now(),
    },
    client: {
      type: String,
      trim: true,
      require: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tasks:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }
    ],
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Projects = mongoose.model('Projects', projectsSchema);

export default Projects;
