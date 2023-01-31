import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

const whiteList = [process.env.CLIENT_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      // Can accesss the api
      callback(null, true);
    } else {
      // Cannot access the api
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Routing
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

//socket io
import { Server } from 'socket.io';

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

io.on('connection', (socket) => {
  socket.on('open project', (project) => {
    socket.join(project);
  });

  socket.on('new task', (task) => {
    const project = task.project;
    socket.to(project).emit('added task', task);
  });

  socket.on('delete task', (task) => {
    const project = task.project;
    socket.to(project).emit('deleted task', task);
  });

  socket.on('update task', (task) => {
    const project = task.project;
    socket.to(project).emit('updated task', task);
  });

  socket.on('change status', (task) => {
    const project = task.project._id;

    socket.to(project).emit('changed status', task);
  });
});
