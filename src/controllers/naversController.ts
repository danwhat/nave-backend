import { Request, Response } from 'express';
import projectsModels from '../models/projectsModels';
import naversProjectsModels from '../models/naversProjectsModels';
import decoderToken from '../utils/decoderToken';
import naversModels from '../models/naversModels';

const getAllByFilter = async (req: Request, res: Response) : Promise<Response> => {
  const { search, filterBy } = req.body;
  const token = req.headers.authorization;
  const decoded = decoderToken(token);

  // checa se existe parametros errados.
  const filters = ['name', 'admissionDate', 'jobRole'];
  if (filterBy && !filters.includes(filterBy)) res.status(400).send({ message: 'Filtro inválido.' });
  if (search && !filterBy) res.status(400).send({ message: 'Filtro não informado.' });
  if (!search && filterBy) res.status(400).send({ message: 'Filtro informado e texto não encontrado.' });

  const response = await naversModels.getAllByFilter(decoded.id, search, filterBy);
  return res.status(200).send(response);
};

const getById = async (req: Request, res: Response) : Promise<Response> => {
  const { id } = req.params;
  const response = await naversModels.getById(id);
  const projects = await naversProjectsModels.getProjectsByNaverId(id);
  if (response.length === 0) res.status(400).send({ message: 'Naver não encontrado.' });
  response[0].projects = projects;
  return res.status(200).send(response[0]);
};

const checkNaverIsValid = async (
  name:string,
  birthdate:string,
  admissionDate:string,
  jobRole:string,
  projects:Array<number>,
) => {
  if (!name) return { message: 'nome não informado.' };
  if (!birthdate) return { message: 'data de nascimento não informada.' };
  if (!admissionDate) return { message: 'data de admição não informada.' };
  if (!jobRole) return { message: 'Cargo não informado.' };
  if (!projects) return { message: 'Projetos não informados.' };
  const valid = await projectsModels.checkProjects(projects);
  if (!valid) return { message: 'Projetos inválidos.' };
  return null;
};

const createNave = async (req: Request, res: Response) : Promise<Response> => {
  const {
    name, birthdate,
    admission_date: admissionDate,
    job_role: jobRole,
    projects,
  } = req.body;
  const token = req.headers.authorization;
  const decoded = decoderToken(token);

  // checa os parametros do naver.
  const failedMessage = await checkNaverIsValid(
    name,
    birthdate,
    admissionDate,
    jobRole,
    projects,
  );
  if (failedMessage) return res.status(400).send(failedMessage);

  // cria o naver.
  const insertId = await naversModels.createNave(name,
    birthdate,
    admissionDate,
    jobRole,
    decoded.id);
  naversProjectsModels.createRelation(insertId, projects);

  return res.status(201).send({
    id: insertId,
    name,
    birthdate,
    admission_date: admissionDate,
    job_role: jobRole,
    projects,
  });
};

const editNave = async (req: Request, res: Response) : Promise<Response> => {
  const {
    id,
    name,
    birthdate,
    admission_date: admissionDate,
    job_role: jobRole,
    projects,
  } = req.body;
  const token = req.headers.authorization;
  const decoded = decoderToken(token);
  // checa se o naver existe e se o usuário pode altera-lo.
  const userId = await naversModels.checkOwner(id);
  if (userId === 0) res.status(400).send({ message: 'naver não encontrado.' });// checar de quem é o navi
  if (userId !== decoded.id) res.status(400).send({ message: 'você não tem permissão para alterar esse naver.' });// checar de quem é o navi

  // checa os parametros do naver.
  const failedMessage = await checkNaverIsValid(
    name,
    birthdate,
    admissionDate,
    jobRole,
    projects,
  );
  if (failedMessage) return res.status(400).send(failedMessage);

  // atualiza naver e refaz a relação.
  await naversModels.editNave(
    name,
    birthdate,
    admissionDate,
    jobRole,
    id,
  );
  await naversProjectsModels.deleteAllbyNaverId(id);
  await naversProjectsModels.createRelation(id, projects);

  return res.status(201).send({
    id,
    name,
    birthdate,
    admission_date: admissionDate,
    job_role: jobRole,
    projects,
  });
};

const deleteNave = async (req: Request, res: Response) : Promise<Response> => {
  const { id } = req.params;
  const token = req.headers.authorization;
  const decoded = decoderToken(token);

  // checa se o naver existe e se o usuário pode altera-lo.
  const userId = await naversModels.checkOwner(id);
  if (userId === 0) res.status(400).send({ message: 'naver não encontrado.' });// checar de quem é o navi
  if (userId !== decoded.id) res.status(400).send({ message: 'você não tem permissão para alterar esse naver.' });// checar de quem é o navi

  await naversProjectsModels.deleteAllbyNaverId(id);
  await naversModels.deleteNave(id);
  return res.status(200).send({ message: 'deletado com sucesso' });
};

export default {
  createNave, getAllByFilter, getById, editNave, deleteNave,
};
