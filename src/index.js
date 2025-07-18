const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const OpenApiValidator = require("express-openapi-validator");

const app = express();
const port = 3000;

const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use(
  OpenApiValidator.middleware({
    apiSpec: "./openapi.yaml",
    validateRequests: true,
    validateResponses: true,
    ignorePaths: /.*\/docs.*/,
  })
);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

app.post("/users", (req, res) => {
  const { name, age, email } = req.body;
  const newUser = {
    id: Date.now().toString(),
    name,
    age,
    email,
  };

  res.status(201).json(newUser);
});

app.listen(port, () => {
  console.log(`Servidor funcionando en puerto ${port}`);
});
