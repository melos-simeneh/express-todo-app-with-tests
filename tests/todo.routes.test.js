const request = require("supertest");
const app = require("../server");
const todoModel = require("../models/todo.model");

beforeEach(() => {
  todoModel.getAll = jest.fn().mockReturnValue([]);
  todoModel.create = jest
    .fn()
    .mockReturnValue({ id: "123", title: "Test Todo", completed: false });
  todoModel.getById = jest
    .fn()
    .mockReturnValue({ id: "123", title: "Test Todo", completed: false });
  todoModel.update = jest
    .fn()
    .mockReturnValue({ id: "123", title: "Updated Todo", completed: true });
  todoModel.delete = jest
    .fn()
    .mockReturnValue({ id: "123", title: "Test Todo", completed: false });
});

describe("Todo API Routes", () => {
  it("should create a new todo", async () => {
    const newTodo = { title: "Test Todo", completed: false };

    const res = await request(app).post("/api/todos").send(newTodo).expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(newTodo.title);
    expect(res.body.completed).toBe(newTodo.completed);
  });

  it("should return 400 for missing title when creating a todo", async () => {
    const newTodo = { completed: false };

    const res = await request(app).post("/api/todos").send(newTodo).expect(400);

    expect(res.body.error).toBe('"title" is required');
  });

  it("should get all todos", async () => {
    todoModel.getAll.mockReturnValue([
      { id: "123", title: "Test Todo", completed: false },
    ]); // Mock response

    const res = await request(app).get("/api/todos").expect(200);

    expect(res.body.length).toBe(1); // Expecting 1 todo
    expect(res.body[0].title).toBe("Test Todo");
  });

  it("should get a todo by ID", async () => {
    const res = await request(app).get("/api/todos/123").expect(200);

    expect(res.body).toHaveProperty("id", "123");
    expect(res.body.title).toBe("Test Todo");
  });

  it("should return 404 for non-existent todo ID", async () => {
    todoModel.getById.mockReturnValue(null); // Mock response for non-existent todo

    const res = await request(app)
      .get("/api/todos/non-existent-id")
      .expect(404);

    expect(res.body.error).toBe("Todo not found");
  });

  it("should update a todo", async () => {
    const updatedTodo = { title: "Updated Todo", completed: true };

    const res = await request(app)
      .put("/api/todos/123")
      .send(updatedTodo)
      .expect(200);

    expect(res.body.id).toBe("123");
    expect(res.body.title).toBe("Updated Todo");
    expect(res.body.completed).toBe(true);
  });

  it("should return 404 for non-existent todo ID when updating", async () => {
    todoModel.update.mockReturnValue(null); // Mock response for non-existent todo

    const updatedTodo = { title: "Updated Todo", completed: true };

    const res = await request(app)
      .put("/api/todos/non-existent-id")
      .send(updatedTodo)
      .expect(404);

    expect(res.body.error).toBe("Todo not found");
  });

  it("should delete a todo", async () => {
    const res = await request(app).delete("/api/todos/123").expect(200);

    expect(res.body.id).toBe("123");
    expect(res.body.title).toBe("Test Todo");
    expect(res.body.completed).toBe(false);
  });

  it("should return 404 for non-existent todo ID when deleting", async () => {
    todoModel.delete.mockReturnValue(null); // Mock response for non-existent todo

    const res = await request(app)
      .delete("/api/todos/non-existent-id")
      .expect(404);

    expect(res.body.error).toBe("Todo not found");
  });
});
