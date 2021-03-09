import connection from './connection';

// const getAll = async (userId: number) : Promise<unknown> => {
//   const [projects] = await connection.execute(
//     'SELECT * FROM navedb.projects WHERE users_id=?;', [userId],
//   );
//   return projects;
// };

const getProjectsByNaverId = async (id: number) : Promise<number[]> => {
  const [naves] = await connection.execute(
    'SELECT projects_id FROM navedb.projects_has_navers WHERE naves_id=?;', [id],
  );
  const projects = [];
  naves.forEach((element) => {
    projects.push(element.projects_id);
  });
  return projects;
};

// const editProject = async (name: string, id: number) : Promise<void> => {
//   await connection.execute(
//     'UPDATE navedb.projects SET name = ? WHERE id = ?;',
//     [name, id],
//   );
// };

const createRelation = async (naverId: number, projects : Array<number>) : Promise<void> => {
  if (projects.length > 0) {
    let querry = 'INSERT INTO navedb.projects_has_navers VALUES ';
    projects.forEach((project) => { querry += `(${project}, ${naverId}), `; });
    querry = querry.slice(0, querry.length - 2);
    querry += ';';
    await connection.execute(querry);
  }
};

const createRelationPNs = async (projectId: number, navers : Array<number>) : Promise<void> => {
  if (navers.length > 0) {
    let querry = 'INSERT INTO navedb.projects_has_navers VALUES ';
    navers.forEach((nave) => { querry += `(${projectId}, ${nave}), `; });
    querry = querry.slice(0, querry.length - 2);
    querry += ';';
    await connection.execute(querry);
  }
};

const deleteAllbyNaverId = async (id: number) : Promise<void> => {
  await connection.execute(
    'DELETE FROM navedb.projects_has_navers WHERE naves_id=?;', [id],
  );
};

const deleteAllbyProjectId = async (id: number) : Promise<void> => {
  await connection.execute(
    'DELETE FROM navedb.projects_has_navers WHERE projects_id=?;', [id],
  );
};

export default {
  createRelation, deleteAllbyNaverId, getProjectsByNaverId, createRelationPNs, deleteAllbyProjectId,
};
