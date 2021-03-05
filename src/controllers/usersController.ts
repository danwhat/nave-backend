import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import usersModels from '../models/usersModels';

const signup = async (req: Request, res: Response) : Promise<Response> => {
  const { email, password } = req.body;

  if (!email) res.status(400).send({ message: 'Email não informado.' });
  if (!password) res.status(400).send({ message: 'Senha não informada.' });

  const duplicated = await usersModels.checkDuplicatedEmail(email);
  if (duplicated) res.status(400).send({ message: 'Email já cadastrado.' });

  await usersModels.createUser(email, password);
  return res.status(201).send({ message: `Usuário para o email ${email} criado com sucesso.` });
};

const login = async (req: Request, res: Response) : Promise<Response> => {
  const { email, password } = req.body;

  if (!email) return res.status(400).send({ message: 'Email não informado.' });
  if (!password) return res.status(400).send({ message: 'Senha não informada.' });

  const response = await usersModels.checkUser(email, password);
  if (!response) res.status(401).send({ message: 'Email ou senha invalido.' });

  const token = jwt.sign({ email, id: 1 }, process.env.SECRET, { expiresIn: '30d', algorithm: 'HS256' });
  return res.status(200).send({ message: 'Conectado com sucesso.', token });
};

export default { login, signup };
