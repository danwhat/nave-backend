import { Request, Response } from 'express';
import { createUser, checkUser } from '../models/usersModels';

const login = async (req: Request, res: Response) : Promise<Response> => {
  const { email, password } = req.body;
  const response = await checkUser(email, password);
  return res.send(response);
};

const signup = async (req: Request, res: Response) : Promise<Response> => {
  const { email, password } = req.body;
  await createUser(email, password);
  return res.send({ message: `Usuário com email ${email} criado com sucesso.` });
};

export default { login, signup };
