const Joi = require("joi");
const {
  createTodoValidation,
  updateTodoValidation,
} = require("../validators/todo.validator");

describe("Todo Validator", () => {
  // Test for the createTodoValidation function
  describe("createTodoValidation", () => {
    it("should validate a valid todo object", () => {
      const todo = {
        title: "Test Todo",
        completed: false,
      };

      const { error } = createTodoValidation(todo);

      // No error should be present for a valid object
      expect(error).toBeUndefined();
    });

    it("should return an error for a missing title", () => {
      const todo = {
        completed: false,
      };

      const { error } = createTodoValidation(todo);

      // Expect error for missing required title
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('"title" is required');
    });

    it("should return an error for an empty title", () => {
      const todo = {
        title: "",
        completed: false,
      };

      const { error } = createTodoValidation(todo);

      // Expect error for empty title
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe(
        '"title" is not allowed to be empty'
      );
    });

    it("should return an error for a short title", () => {
      const todo = {
        title: "Hi", // Title is too short
        completed: false,
      };

      const { error } = createTodoValidation(todo);

      // Expect error for title length < 3 characters
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe(
        '"title" length must be at least 3 characters long'
      );
    });

    it("should return an error for invalid title type", () => {
      const todo = {
        title: 123, // Invalid type (should be string)
        completed: false,
      };

      const { error } = createTodoValidation(todo);

      // Expect error for invalid type of title
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('"title" must be a string');
    });
  });

  // Test for the updateTodoValidation function
  describe("updateTodoValidation", () => {
    it("should validate a valid update todo object", () => {
      const todo = {
        title: "Updated Todo",
        completed: true,
      };

      const { error } = updateTodoValidation(todo);

      // No error should be present for a valid object
      expect(error).toBeUndefined();
    });

    it("should return an error for a missing title during update", () => {
      const todo = {
        completed: true,
      };

      const { error } = updateTodoValidation(todo);

      // Expect error for missing required title
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('"title" is required');
    });

    it("should return an error for a short title during update", () => {
      const todo = {
        title: "No", // Title is too short
        completed: true,
      };

      const { error } = updateTodoValidation(todo);

      // Expect error for title length < 3 characters
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe(
        '"title" length must be at least 3 characters long'
      );
    });

    it("should return an error for invalid title type during update", () => {
      const todo = {
        title: 456, // Invalid type (should be string)
        completed: true,
      };

      const { error } = updateTodoValidation(todo);

      // Expect error for invalid type of title
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('"title" must be a string');
    });
  });
});
