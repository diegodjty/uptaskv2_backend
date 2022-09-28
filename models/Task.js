import mongoose from 'mongoose';

const TaskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    priority: {
      type: String,
      require: true,
      enum: ['Low', 'Medium', 'High'],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Projects',
    },
    completed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamp: true,
  }
);

const Task = mongoose.model('Task', TaskSchema);

export default Task;
