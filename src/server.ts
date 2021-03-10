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
server.post('/navers/store', checkToken, naveController.createNave);
server.get('/navers/:id', checkToken, naveController.getById);
server.post('/navers', checkToken, naveController.getAllByFilter);
server.put('/navers/update', checkToken, naveController.editNave);
server.delete('/navers/delete/:id', checkToken, naveController.deleteNave);

// // projects
server.post('/projects', checkToken, projectsController.createProject);
server.get('/projects/:id', checkToken, projectsController.getById);
server.get('/projects', checkToken, projectsController.getAllByUser);
server.put('/projects', checkToken, projectsController.editProject);
server.delete('/projects/:id', checkToken, projectsController.deleteProject);

server.listen(process.env.PORT);
