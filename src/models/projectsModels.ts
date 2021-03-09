import connection from './connection';

const getAllByUserId = async (userId: number, search: string) : Promise<unknown> => {
  if (search) {
    const [projects] = await connection.execute(
      `SELECT id, name FROM navedb.projects WHERE users_id=${userId} AND name LIKE "%${search}%";`,
    );
    return projects;
  }
  const [projects] = await connection.execute(
    'SELECT id, name FROM navedb.projects WHERE users_id=?;', [userId],
  );
  return projects;
};

const getNaversByProject = async (projectId: number) : Promise<unknown> => {
  const [navers] = await connection.execute(`SELECT id, name, birthdate, admission_date, job_role
  FROM navedb.projects_has_navers r
  JOIN navedb.navers n
  ON n.id = r.naves_id
  WHERE r.projects_id=${projectId};`);
  const retorno = [];
  navers.forEach((element) => {
    const newNaver = {
      id: element.id,
      name: element.name,
      birthdate: element.birthdate,
      admission_date: element.admission_date,
      job_role: element.job_role,
    };
    retorno.push(newNaver);
  });
  return retorno;
};

const getById = async (id: number) : Promise<unknown> => {
  const nave = await connection.execute(
    'SELECT * FROM navedb.projects WHERE id=?;', [id],
  );
  return nave[0];
};

const editProject = async (name: string, id: number) : Promise<void> => {
  await connection.execute(
    'UPDATE navedb.projects SET name = ? WHERE id = ?;',
    [name, id],
  );
};

const createProject = async (name: string, id : number) : Promise<number> => {
  const project = await connection.execute('INSERT INTO navedb.projects (name, users_id) VALUES (?, ?);', [name, id]);
  return project[0].insertId;
};

const deleteProject = async (id: number) : Promise<void> => {
  await connection.execute(
    'DELETE FROM navedb.projects WHERE id=?;', [id],
  );
};

const checkProjects = async (projects) => {
  const [projectDB] = await connection.execute('SELECT id FROM navedb.projects;');
  const arrayIdProjectsDB = [];
  projectDB.forEach((element) => { arrayIdProjectsDB.push(element.id); });
  const valid = projects.every((e) => arrayIdProjectsDB.includes(e));
  return valid;
};

const checkOwner = async (id:number) : Promise<number> => {
  const owner = await connection.execute(
    'SELECT users_id FROM navedb.projects WHERE id = ?;', [id],
  );
  try {
    const userId = owner[0][0].users_id;
    return userId;
  } catch { return 0; }
};

export default {
  createProject, getAllByUserId, getById, editProject, deleteProject, checkProjects, getNaversByProject, checkOwner,
};
