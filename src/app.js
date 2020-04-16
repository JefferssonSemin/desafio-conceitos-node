const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
  };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request.params;


  const indexRepository = repositories.findIndex(repository => repository.id === id);

  if(indexRepository < 0){return response.status(400).json("Repository does not exist");}

  const {likes} = repositories[indexRepository]; 

  const newRepository = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[indexRepository]= newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  if(!isUuid(id)){return response.status(400).json("Id does not valid");}

  const repository = repositories.find(repo => repo.id === id);

  repositories.splice(repository, 1);

 return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  if(!isUuid(id)){ return response.status(400).json("Id does not valid");}

  const currentIndexRepository = repositories.findIndex(repo => repo.id === id);

  if(currentIndexRepository < 0){
    return response.status(400).json("Repository does not exist");
  }

  const currentRepository = repositories[currentIndexRepository];
  
  currentRepository.likes++;
 
  return response.json(currentRepository);
});

module.exports = app;
