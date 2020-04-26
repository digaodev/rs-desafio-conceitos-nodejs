const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs = [] } = request.body;

  const newRepo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs = [] } = request.body;
  const { id } = request.params;

  const originalRepoIndex = repositories.findIndex((repo) => repo.id === id);

  if (originalRepoIndex === -1) {
    return response.status(400).send();
  }

  const originalRepo = repositories.find((repo) => repo.id === id);
  const updatedRepo = { ...originalRepo, title, url, techs };

  repositories = [
    ...repositories.slice(0, originalRepoIndex),
    updatedRepo,
    ...repositories.slice(originalRepoIndex + 1),
  ];

  return response.json(updatedRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex === -1) {
    return response.status(400).send();
  }
  repositories = repositories.filter((repo) => repo.id !== id);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const originalRepoIndex = repositories.findIndex((repo) => repo.id === id);
  const originalRepo = repositories.find((repo) => repo.id === id);

  if (!originalRepo) {
    return response.status(400).send();
  }

  const updatedRepo = { ...originalRepo, likes: originalRepo.likes + 1 };

  repositories = [
    ...repositories.slice(0, originalRepoIndex),
    updatedRepo,
    ...repositories.slice(originalRepoIndex + 1),
  ];

  return response.json(updatedRepo);
});

module.exports = app;
