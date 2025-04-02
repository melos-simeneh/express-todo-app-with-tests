const todoModel = require("../models/todo.model");
const { v4: uuidv4 } = require("uuid");

describe("Todo Model", () => {
  it("should create a todo with valid data", () => {
    const newTodo = { id: uuidv4(), title: "Test Todo", completed: false };
    const createdTodo = todoModel.create(newTodo);
    expect(createdTodo).toHaveProperty("id");
    expect(createdTodo.title).toBe("Test Todo");
    expect(createdTodo.completed).toBe(false);
  });

  it("should update an existing todo", () => {
    const newTodo = { id: uuidv4(), title: "Old Todo", completed: false };
    const createdTodo = todoModel.create(newTodo);
    const updatedTodo = todoModel.update(createdTodo.id, {
      id: createdTodo.id,
      title: "Updated Todo",
      completed: true,
    });

    expect(updatedTodo.title).toBe("Updated Todo");
    expect(updatedTodo.completed).toBe(true);
  });

  it("should return null when updating a non-existent todo", () => {
    const updatedTodo = todoModel.update("non-existent-id", {
      title: "Updated Todo",
      completed: true,
    });
    expect(updatedTodo).toBeNull();
  });

  it("should delete an existing todo", () => {
    const newTodo = { id: uuidv4(), title: "Delete Me", completed: false };
    const createdTodo = todoModel.create(newTodo);
    const deletedTodo = todoModel.delete(createdTodo.id);

    expect(deletedTodo.title).toBe("Delete Me");
  });

  it("should return null when deleting a non-existent todo", () => {
    const deletedTodo = todoModel.delete("non-existent-id");
    expect(deletedTodo).toBeNull();
  });

  it("should get all todos", () => {
    const newTodo = { id: uuidv4(), title: "Get Me", completed: false };
    todoModel.create(newTodo);
    const todos = todoModel.getAll();

    expect(todos.length).toBeGreaterThan(0);
  });

  it("should get a todo by ID", () => {
    const newTodo = { id: uuidv4(), title: "Find Me", completed: false };
    const createdTodo = todoModel.create(newTodo);
    const foundTodo = todoModel.getById(createdTodo.id);

    expect(foundTodo.title).toBe("Find Me");
  });

  it("should return null when getting a non-existent todo by ID", () => {
    const foundTodo = todoModel.getById("non-existent-id");
    expect(foundTodo).toBeNull();
  });
});
