const todoModel = require("../models/todo.model");
const {
  createTodoValidation,
  updateTodoValidation,
} = require("../validators/todo.validator");
const { v4: uuidv4 } = require("uuid");

exports.getAllTodos = (req, res) => {
  res.json(todoModel.getAll());
};

exports.getTodoById = (req, res) => {
  const todo = todoModel.getById(req.params.id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json(todo);
};

exports.createTodo = (req, res) => {
  const { error } = createTodoValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const newTodo = {
    id: uuidv4(),
    title: req.body.title,
    completed: req.body.completed || false,
  };

  const createdTodo = todoModel.create(newTodo);
  res.status(201).json(createdTodo);
};

exports.updateTodo = (req, res) => {
  const { error } = updateTodoValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const updatedTodo = todoModel.update(req.params.id, req.body);
  if (!updatedTodo) return res.status(404).json({ error: "Todo not found" });
  res.json(updatedTodo);
};

exports.deleteTodo = (req, res) => {
  const deletedTodo = todoModel.delete(req.params.id);
  if (!deletedTodo) return res.status(404).json({ error: "Todo not found" });
  res.json(deletedTodo);
};
