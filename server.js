const express = require("express");
const app = express();
const todoRoutes = require("./routes/todo.routes");

app.use(express.json());
app.use("/api/todos", todoRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});
module.exports = app;
