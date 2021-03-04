import express from 'express';
import 'dotenv/config';
import checkToken from './middleware/checkToken';
import userController from './controllers/usersController';
import naveController from './controllers/navesController';
// import projectsController from './controllers/projectsController';

const server = express();
server.use(express.json());

// login page
server.post('/signup', userController.signup);
server.post('/login', userController.login);

// naves
server.post('/nave', checkToken, naveController.createNave);
server.get('/nave/:id', checkToken, naveController.getById);
server.get('/nave', checkToken, naveController.getAllByUser);
server.put('/nave', checkToken, naveController.editNave);
server.delete('/nave/:id', checkToken, naveController.deleteNave);

// projects
// server.get('/projects', projectsController.getAllByUser);

server.listen(3000);
