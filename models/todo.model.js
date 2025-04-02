const todos = [];
module.exports = {
  getAll: () => todos,
  getById: (id) => todos.find((todo) => todo.id === id) || null,
  create: (todo) => {
    todos.push(todo);
    return todo;
  },
  update: (id, updatedTodo) => {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      todos[index] = updatedTodo;
      return updatedTodo;
    }
    return null;
  },
  delete: (id) => {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      return todos.splice(index, 1)[0];
    }
    return null;
  },
};
