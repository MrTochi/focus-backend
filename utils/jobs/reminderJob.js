import cron from "node-cron";
import Todo from "../../model/userTodoModel.js";
import { todoReminderTemplate } from "../emailTemplates.js";
import { sendEmail } from "../sendEmail.js";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  try {
    const todosToRemind = await Todo.find({
      reminder: { $lte: now },
      notified: false,
    }).populate("userId");

    for (const todo of todosToRemind) {
      await sendEmail(
        todo.userId.email,
        "Todo Reminder",
        todoReminderTemplate(
          todo.userId.name,
          todo.title,
          todo.dueDate.toLocaleDateString()
        )
      );

      todo.notified = true;
      await todo.save();
    }
  } catch (err) {}
});
