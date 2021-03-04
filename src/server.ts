import express from 'express';
import 'dotenv/config';
import userController from './controllers/userController';

const server = express();
server.use(express.json());

server.post('/signup', userController.signup);
server.post('/login', userController.login);

server.listen(3000);
