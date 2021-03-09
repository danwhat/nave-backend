import express from 'express';
import 'dotenv/config';
import checkToken from './middleware/checkToken';
import userController from './controllers/usersController';
import naveController from './controllers/naversController';
import projectsController from './controllers/projectsController';

const server = express();
server.use(express.json());

// login page
server.post('/signup', userController.signup);
server.post('/login', userController.login);

// naves
server.post('/navers/store', naveController.createNave);
server.get('/navers/:id', naveController.getById);
server.post('/navers', naveController.getAllByFilter);
server.put('/navers/update', naveController.editNave);
server.delete('/navers/delete/:id', naveController.deleteNave);

// // projects
server.post('/projects', projectsController.createProject);
server.get('/projects/:id', projectsController.getById);
server.get('/projects', projectsController.getAllByUser);
server.put('/projects', projectsController.editProject);
server.delete('/projects/:id', projectsController.deleteProject);

server.listen(3000);
