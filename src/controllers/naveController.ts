import { Request, Response } from 'express';
import navesModels from '../models/navesModels';
import decoderToken from '../utils/decoderToken';

const getAll = async (req: Request, res: Response) : Promise<Response> => {
  const token = req.headers.authorization;
  const decoded = decoderToken(token);
  const response = await navesModels.getAll(decoded.id);
  return res.status(200).send(response);
};

const createNave = async (req: Request, res: Response) : Promise<Response> => {
  const {
    name, birthdate, admission_date: admissionDate, job_role: jobRole, users_id: usersId,
  } = req.body;
  await navesModels.createNave(name, birthdate, admissionDate, jobRole, usersId);
  return res.status(201).send({
    name,
    birthdate,
    admission_date: admissionDate,
    job_role: jobRole,
    users_id: usersId,
  });
};

export default { createNave, getAll };
