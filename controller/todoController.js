import Todo from "../model/userTodoModel.js";

// CREATE TODO
export const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, reminder, priority } = req.body;

    const newTodo = await Todo.create({
      userId: req.user._id,
      title,
      description,
      dueDate,
      reminder,
      priority,
    });

    res.status(201).json({
      message: "Todo created successfully",
      success: true,
      todo: newTodo,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
      success: false,
    });
  }
};

// GET ALL TODOS FOR A USER
export const getTodo = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Todos fetched successfully",
      success: true,
      todos,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
      success: false,
    });
  }
};

// GET TODO BY ID
export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Todo fetched successfully",
      success: true,
      todo,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
      success: false,
    });
  }
};

// EDIT/UPDATE TODO CONTENT
export const editTodo = async (req, res) => {
  try {
    const { title, description, dueDate, reminder, priority } = req.body;

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
        success: false,
      });
    }

    // Update only if new value provided
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (reminder !== undefined) todo.reminder = reminder;
    if (priority !== undefined) todo.priority = priority;

    await todo.save();

    res.status(200).json({
      message: "Todo updated successfully",
      success: true,
      todo,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
      success: false,
    });
  }
};

// DELETE TODO
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
        success: false,
      });
    }

    await todo.deleteOne();

    res.status(200).json({
      message: "Todo deleted successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
      success: false,
    });
  }
};

// TOGGLE COMPLETED STATUS
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
        success: false,
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json({
      message: "Todo status toggled successfully",
      success: true,
      todo,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
      success: false,
    });
  }
};
