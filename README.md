## O Projeto

Desafio back-end da Nave.  Foi criado um sistema com gerenciamento de Navers e Projetos e o relacionamento entre eles, além de um sistema simples de login e autenticação com JWT. O sistema foi construido utilizando um banco de dados MySQL.

## Dificuldades

Apesar de entender que se trata de um projeto simples, foi extremamente desafiador concluí-lo.
Por não ter muita experiência, a cada nova etapa alcançada eu via um jeito novo de refatorar a etapa anterior e a todo momento eu sentia que existia alguma forma melhor de fazer o que eu estava fazendo.
- **Abstração** - Antes desse projeto eu só havia feito **CRUD's** simples (com apenas uma tabela). E apesar de saber como fazer **CRUD's** mais complexos na teoria, a prática foi mais complicada do que eu esperava.
- **Tempo** - Mas uma vez, pela falta de experiência, subestimei o tempo que levaria para concluir o projeto. Entreguei todos os requisitos, mas acredito que com alguns dias a mais poderia ter refatorado algumas coisas e entregado um código melhor.
- **Typescript** - Por achar que seria simples, julguei interessante criar o sistema em Typescript para aprender algo novo. Apos os desafios começarem a aparecer, eu tive que deixar o Typescript de lado (utilizando muitas vezes artificios como **any** ou **unkown**), e com isso não aproveitei as vantagens de usa-lo nem pratiquei tanto quanto gostaria.

## Aprendizados
Além da prática em si, eu percebi que preciso estudar mais sobre Arquitetura de Software, pois em nenhum momento tive dificuldade com código, conseguia criar tudo que eu queria. O problema é que eu não sabia como deveria construir o sistema.

## Testando o Sistema
Após fazer o download do projeto, você precisará instalar suas dependências com `npm instal` ou `yarn`. Feito isso, está na hora de configurar o banco de dados **MySQL**.  O Sistema utiliza cinco variáveis de ambiente para funcionar:
- USER - Nome de usuário MySQL.
- PASS - Senha do usuário MySQL.
- PORT - Porta utilizada.
- HOST - Endereço utilizado.
- SECRET - Segredo utilizado para gerar o JWT.

O último passo é criar o banco de dados. Crie o banco de dados **navedb** e utilize o arquivo **navedb.sql** encontrado na raiz do projeto. Ele contém uma sequência de comandos **sql** que criará as tabelas, relações e povoará-lo.

**Tudo pronto!** Agora rode o comando `yarn run dev` e o sistema estará no ar!
## Rotas de Autenticação

**POST - /signup**
Rota para criação de usuário. 
Recebe  através do **body** da requisição o email e senha, e cria um usuário.

```json
// Corpo da requisição:
{
	email:"usuario@email.com",
	password: "senha123"
}
```

```json
// Feedback positivo:
{ message:"Usuário para o email email@email.com criado com sucesso.", }

// Possiveis feedbacks negativos:
XXXXXXXXXXXXXXXXXXXXXXX{ message:"Formato de email inválido." }
{ message:"Email já utilizado." }
{ message:"Email não informado." }
{ message:"Senha não informada." }
```

**POST - /login**
Rota para login.
Recebe através do **body** da requisição um email e senha válidos e retorna um **token JWT**.
```json
// Corpo da requisição:
{
	email:"usuario@email.com",
	password: "senha123"
}
```

```json
// Feedback positivo:
{ 
	message: "Conectado com sucesso.",
	token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}

// Possiveis feedbacks negativos:
{ message:"Email não informado." }
{ message:"Senha não informada." }
{ message:"Email ou senha invalido." }
```
**OBS:** O Token deve ser enviado pelo **header** da requisição utilizando a chave `authorization`.

## Rota de Navers

**POST - /naves**
Rota para listagem dos navers. Requer token válido.
- Caso não receba nenhum parâmetro retorna um **array** todos os navers criado pelo usuário.
- Caso receba parâmetros de busca, retorna um **array** com o resultado filtrado.
```json
// Corpo da requisição:
//Possiveis filtros: name / admissionDate / jobRole
{
	search: "Maria",
	filterBy: "name"
}
```

```json
// Feedback positivo:
[
  {
    id: 1,
    name: "Maria",
    birthdate: "1985-05-05",
    admission_date: "2013-05-05",
    job_role: "Programadora",
  }
]

// Possiveis feedbacks negativos:
{ message:"Filtro inválido." }
{ message:"Filtro não informado." }
{ message:"Filtro informado e texto não encontrado." }
```

**POST - /navers/1**
Rota para detalhes de um naver. Requer token válido.
Recebe o **id** do naver através da **url** e  retorna um objeto contendo informações sobre o naver.
```json
// Feedback positivo:
{
  id: 1,
  name: "Maria",
  birthdate: "1985-05-05",
  admission_date: "2013-05-05",
  job_role: "Programadora",
  projects: [1]
}

// Possivel feedback negativo:
{ message:  'Naver não encontrado.' }
```

**POST - /naves/store**
Rota para criar um naver. Requer token válido.
Recebe através do **body** da requisição os dados do naver e um **array** com os identificadores dos projetos que ele participa e cria um registro no banco de dados vinculado ao usuário que fez a requisição.
```json
// Corpo da requisição:
{
	name : "Bruno",
	birthdate: "1999-02-01",
	admission_date: "2018-12-15",
	job_role: "Programador",
	projects: [1,2]
}
```
```json
// Feedback positivo:
{
	id: 1,
	name :"Bruno",
	birthdate: "1999-02-01",
	admission_date: "2018-12-15",
	job_role: "Programador",
	projects: [1,2]
}

// Possiveis feedbacks negativos:
{ message: 'nome não informado.' }
{ message: 'data de nascimento não informada.' }
{ message: 'data de admição não informada.' }
{ message: 'Cargo não informado.' }
{ message: 'Projetos não informados.' }
{ message: 'Projetos inválidos.' }
```
  
**POST - /naves/update**
Rota Para Atualização de Naver. Requer token válido.
Recebe através do **body** da requisição os dados do naver e um **array** com os identificadores dos projetos que ele participa e atualiza seu registro no banco de dados.
```json
// Corpo da requisição:
{
	id : 7,
	name :"Maria",
	birthdate: "1995-05-01",
	admission_date: "2013-07-23",
	job_role: "Programadora",
	projects: [1,2]
}
```
```json
// Feedback positivo:
{
	name :"Maria",
	birthdate: "1995-05-05",
	admission_date: "2013-05-05",
	job_role: "Programadora",
	projects: [1,2]
}

// Possiveis feedbacks negativos:
{ message: 'naver não encontrado.' }
{ message: 'você não é tem permissão para alterar esse naver.' }
	
{ message: 'nome não informado.' }
{ message: 'data de nascimento não informada.' }
{ message: 'data de admição não informada.' }
{ message: 'Cargo não informado.' }
{ message: 'Projetos não informados.' }
{ message: 'Projetos inválidos.' }
```

**DELETE - /naves/delete/1**
Rota Para Deletar um naver. Requer token válido.
Recebe o id do naver a ser deletado através da **url** e o deleta caso o usuário tenha permissão .
```json
// Feedback positivo:
{ message: 'naver deletado com sucesso.' }

// Possiveis feedbacks negativos:
{ message: 'naver não encontrado.' }
{ message: 'você não tem permissão para alterar esse naver.' }
```
## Rotas de Projetos
**POST - /projetos**
Rota para listagem dos projetos. Requer token válido.
- Caso não receba nenhum parâmetro retorna um **array** todos os projetos criados pelo usuário.
- Caso receba o parâmetro de busca, retorna um **array** com o mesmo resultado filtrado pelo nome.
```json
// Corpo da requisição:
{ search: "Secreto" }
```

```json
// Feedback positivo:
[
  {
    id: 3,
    name: "Projeto Secreto"
  }
]
```
**POST - /projects/1**
Rota para detalhes de um Projeto. Requer token válido.
Recebe o **id** do projeto através da **url** e  retorna um objeto contendo informações sobre o projeto e seus participantes.
```json
// Feedback positivo:
{
  id": 3,
  name": "Projeto Secreto",
  users_id": 1,
  navers": [
    {
      id": 2,
      name: "Bruno",
      birthdate: "1999-02-01",
      admission_date: "2018-12-15",
      job_role: "Programador"
    }
  ]
}
    
// Possiveis feedbacks negativos:
{ message: 'projeto não encontrado.' }
```
**POST - /projects/store**
Rota para criar um projeto. Requer token válido.
Recebe através do **body** da requisição o nome do projeto e seus participantes, e cria um novo registro no banco de dados vinculado ao usuário que fez a requisição.
```json
// Corpo da requisição:
{
	name: "Projeto Supimpa",
	navers: [1,2]
}
```
```json
// Feedback positivo:

{
  name: "Projeto Supimpa",
  navers: [1,2]
}

// Possiveis feedbacks negativos:
{ message: 'nome do projeto não informado.' }
{ message: 'navers invalidos' }
```
**POST - /projects/update**
Rota Para Atualização de Naver. Requer token válido.
Recebe através do **body** da requisição o nome do projeto, seu id e seus participantes, e atualiza seu registro no banco de dados caso o usuário tenha permissão.
```json
// Corpo da requisição:
{
	name: "Projeto Supimpa",
	navers: [1,2]
}
```json
// Feedback positivo:
{
	name: "Projeto Supimpa",
	navers: [1,2]
}

// Possiveis feedbacks negativos:
{ message: 'você não tem permissão para alterar esse projeto.' }
{ message: 'nome não informado.' }
{ message: 'um ou mais navers invalidos' }
```

**DELETE - /naves/delete/1**
Rota Para Deletar um projeto. Requer token válido.
Recebe através da **url** o id do projeto e o delete  caso o usuário tenha permissão.
```json
// Feedback positivo:
{ message: 'Projeto deletado com sucesso.' }

// Possiveis feedbacks negativos:
{ message: 'Projeto não encontrado.' }
{ message: 'Você não tem permissão para deletar este projeto.' }
```
