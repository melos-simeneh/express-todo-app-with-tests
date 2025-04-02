const request = require("supertest");
const app = require("../server");
const todoModel = require("../models/todo.model");

jest.mock("../models/todo.model");

describe("Todo Controller", () => {
  let testTodoId;

  // Reset mocks before each test to ensure a clean state
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new todo", async () => {
    const mockTodo = { id: "1", title: "Test Todo", completed: false };
    todoModel.create.mockReturnValue(mockTodo); // Mock model create method

    const res = await request(app)
      .post("/api/todos")
      .send({ title: "Test Todo" });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Todo");
    testTodoId = res.body.id; // Save ID for further tests
  });

  it("should fail to create a todo with missing title", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ completed: false });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('"title" is required');
  });

  it("should fail to create a todo with short title", async () => {
    const res = await request(app).post("/api/todos").send({ title: "Hi" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      '"title" length must be at least 3 characters long'
    );
  });

  it("should fail to create a todo with invalid completed value", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ title: "Test Todo", completed: "invalid" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('"completed" must be a boolean');
  });

  it("should get all todos", async () => {
    const mockTodos = [{ id: "1", title: "Test Todo 1", completed: false }];
    todoModel.getAll.mockReturnValue(mockTodos);

    const res = await request(app).get("/api/todos");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get a todo by ID", async () => {
    const mockTodo = { id: "1", title: "Test Todo", completed: false };
    todoModel.getById.mockReturnValue(mockTodo); // Mock model getById method

    const res = await request(app).get(`/api/todos/${testTodoId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testTodoId);
  });

  it("should return 404 for non-existent todo ID", async () => {
    todoModel.getById.mockReturnValue(null); // Mock non-existent todo

    const res = await request(app).get("/api/todos/non-existent-id");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Todo not found");
  });

  it("should update a todo", async () => {
    const mockTodo = { id: testTodoId, title: "Updated Todo", completed: true };
    todoModel.update.mockReturnValue(mockTodo); // Mock model update method

    const res = await request(app)
      .put(`/api/todos/${testTodoId}`)
      .send({ title: "Updated Todo", completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Todo");
  });

  it("should return 404 for non-existent todo when updating", async () => {
    todoModel.update.mockReturnValue(null); // Mock non-existent todo

    const res = await request(app)
      .put("/api/todos/non-existent-id")
      .send({ title: "Updated Todo" });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Todo not found");
  });

  it("should return 400 for invalid update data", async () => {
    const res = await request(app)
      .put(`/api/todos/${testTodoId}`)
      .send({ title: "Updated Todo", completed: "invalid" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('"completed" must be a boolean');
  });

  it("should delete a todo", async () => {
    const mockTodo = { id: testTodoId, title: "Test Todo", completed: false };
    todoModel.delete.mockReturnValue(mockTodo); // Mock model delete method

    const res = await request(app).delete(`/api/todos/${testTodoId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Test Todo");
  });

  it("should return 404 for non-existent todo when deleting", async () => {
    todoModel.delete.mockReturnValue(null); // Mock non-existent todo

    const res = await request(app).delete("/api/todos/non-existent-id");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Todo not found");
  });

  it("should return 404 for non-existent todo when deleting using invalid ID format", async () => {
    const res = await request(app).delete("/api/todos/invalid-id");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Todo not found");
  });
});
