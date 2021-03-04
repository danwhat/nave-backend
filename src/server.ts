import express from 'express';
import 'dotenv/config';
import checkToken from './middleware/checkToken';
import userController from './controllers/userController';
import naveController from './controllers/naveController';

const server = express();
server.use(express.json());

server.get('/', checkToken, (req, res) => {
  res.send('oi');
});
// user
server.post('/nave', naveController.createNave);
server.get('/nave/:id', naveController.getById);
server.get('/nave', naveController.getAllByUser);
server.put('/nave', naveController.editNave);

// login page
server.post('/signup', userController.signup);
server.post('/login', userController.login);

server.listen(3000);
