import { Request, Response } from 'express';
import naversModels from '../models/naversModels';
import naversProjectsModels from '../models/naversProjectsModels';
import projectsModels from '../models/projectsModels';
import decoderToken from '../utils/decoderToken';

const getAllByUser = async (req: Request, res: Response) : Promise<Response> => {
  const { search } = req.body;
  const token = req.headers.authorization;
  const decoded = decoderToken(token);
  const projects = await projectsModels.getAllByUserId(decoded.id, search);
  return res.status(200).send(projects);
};

const getById = async (req: Request, res: Response) : Promise<Response> => {
  const { id } = req.params;
  const response = await projectsModels.getById(id);
  if (response.length === 0) return res.status(400).send({ message: 'projeto não encontrado.' });
  const navers = await projectsModels.getNaversByProject(id);

  response[0].navers = navers;
  return res.status(200).send(response[0]);
};

const createProject = async (req: Request, res: Response) : Promise<Response> => {
  const { name, navers } = req.body;
  // checar nome
  if (!name) return res.status(400).send({ message: 'nome do projeto não informado.' });
  // checar navers
  const naversFromDB = await naversModels.getByArrayId(navers);
  console.log(naversFromDB.length);
  if (naversFromDB.length !== navers.length) return res.status(400).send({ message: 'navers invalidos' });
  // criar projeto e relação.
  const token = req.headers.authorization;
  const decoded = decoderToken(token);
  const createdProjectId = await projectsModels.createProject(name, decoded.id);
  await naversProjectsModels.createRelationPNs(createdProjectId, navers);

  return res.status(201).send({
    name, navers,
  });
};

const editProject = async (req: Request, res: Response) : Promise<Response> => {
  const token = req.headers.authorization;
  const decoded = decoderToken(token);
  const { id, name, navers } = req.body;

  // checa se o projeto existe e se o usuário pode altera-lo.
  const userId = await projectsModels.checkOwner(id);
  if (userId === 0) return res.status(400).send({ message: 'Projeto não encontrado.' });// checar de quem é o navi
  if (userId !== decoded.id) return res.status(400).send({ message: 'você não tem permissão para alterar esse naver.' });// checar de quem é o navi

  // checa navers
  const naversFromDB = await naversModels.getByArrayId(navers);
  if (naversFromDB.length !== navers.length) return res.status(400).send({ message: 'navers invalidos' });

  await naversProjectsModels.deleteAllbyProjectId(id);
  await naversProjectsModels.createRelationPNs(id, navers);
  await projectsModels.editProject(name, id);
  return res.status(201).send({
    name,
    id,
    navers,
  });
};

const deleteProject = async (req: Request, res: Response) : Promise<Response> => {
  const token = req.headers.authorization;
  const decoded = decoderToken(token);
  const { id } = req.params;
  const userId = await projectsModels.checkOwner(id);
  if (userId === 0) return res.status(400).send({ message: 'Projeto não encontrado.' });// checar de quem é o navi
  if (userId !== decoded.id) return res.status(400).send({ message: 'você não tem permissão para alterar esse naver.' });// checar de quem é o navi
  await naversProjectsModels.deleteAllbyProjectId(id);
  await projectsModels.deleteProject(id);
  return res.status(200).send({ message: 'deletado com sucesso' });
};

export default {
  getAllByUser, createProject, getById, editProject, deleteProject,
};
