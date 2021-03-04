import { Request, Response } from 'express';
import navesModels from '../models/navesModels';
import decoderToken from '../utils/decoderToken';

const getAllByUser = async (req: Request, res: Response) : Promise<Response> => {
  const token = req.headers.authorization;
  const decoded = decoderToken(token);
  const response = await navesModels.getAll(decoded.id);
  return res.status(200).send(response);
};

const getById = async (req: Request, res: Response) : Promise<Response> => {
  const { id } = req.params;
  const response = await navesModels.getById(id);
  return res.status(200).send(response[0]);
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

const editNave = async (req: Request, res: Response) : Promise<Response> => {
  const {
    id: Id, name, birthdate, admission_date: admissionDate, job_role: jobRole,
  } = req.body;
  await navesModels.editNave(name, birthdate, admissionDate, jobRole, Id);
  return res.status(201).send({
    name,
    birthdate,
    admission_date: admissionDate,
    job_role: jobRole,
  });
};

const deleteNave = async (req: Request, res: Response) : Promise<Response> => {
  const { id } = req.params;
  await navesModels.deleteNave(id);
  return res.status(200).send({ message: 'deletado com sucesso' });
};

export default {
  createNave, getAllByUser, getById, editNave, deleteNave,
};
