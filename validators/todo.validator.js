const Joi = require("joi");

const createTodoValidation = (todo) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    completed: Joi.boolean().optional(),
  });

  return schema.validate(todo);
};

const updateTodoValidation = (todo) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    completed: Joi.boolean().optional(),
  });

  return schema.validate(todo);
};

module.exports = {
  createTodoValidation,
  updateTodoValidation,
};
