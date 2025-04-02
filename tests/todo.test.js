const request = require("supertest");
const app = require("../server");

let testTodoId;

describe("Todo API", () => {
  it("should fail to create a todo without a title", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ completed: false });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('"title" is required');
  });

  it("should create a new todo", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ title: "Test Todo" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Test Todo");

    testTodoId = res.body.id;
  });

  it("should fail to create a todo with a short title", async () => {
    const res = await request(app).post("/api/todos").send({ title: "Hi" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      '"title" length must be at least 3 characters long'
    );
  });

  it("should get all todos", async () => {
    const res = await request(app).get("/api/todos");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a todo by ID", async () => {
    const res = await request(app).get(`/api/todos/${testTodoId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testTodoId);
  });

  it("should fail to get a non-existent todo", async () => {
    const res = await request(app).get("/api/todos/invalid-id");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Todo not found");
  });

  it("should update a todo", async () => {
    const res = await request(app)
      .put(`/api/todos/${testTodoId}`)
      .send({ title: "Updated Todo" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Todo");
  });

  it("should fail to update a non-existent todo", async () => {
    const res = await request(app)
      .put("/api/todos/invalid-id")
      .send({ title: "New Title" });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Todo not found");
  });

  it("should delete a todo", async () => {
    // First, create a todo before attempting to delete it
    const createRes = await request(app)
      .post("/api/todos")
      .send({ title: "Test Todo for Deletion" });

    expect(createRes.statusCode).toBe(201); // Ensure todo is created
    const testTodoId = createRes.body.id;

    // Now try to delete the created todo
    const res = await request(app).delete(`/api/todos/${testTodoId}`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to delete a non-existent todo", async () => {
    const res = await request(app).delete("/api/todos/invalid-id");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Todo not found");
  });
  it("should return 404 for undefined routes", async () => {
    const res = await request(app).get("/api/non-existent-route");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Route not found");
  });
});
