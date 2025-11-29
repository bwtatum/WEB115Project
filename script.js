// Task data array to store all tasks
let tasks = [];

// Helper function to log tasks as JSON every time tasks change
function logTasks() {
  console.log(JSON.stringify(tasks));
}

// Renders all tasks inside the #taskmanager div using innerHTML
function renderTasks() {
  const container = document.getElementById("taskmanager");

  // Safety check in case the container is missing
  if (!container) return;

  // If no tasks exist, show the empty message
  if (tasks.length === 0) {
    container.innerHTML = '<p class="empty-message">No tasks yet. Add one to get started.</p>';
    return;
  }

  let html = "";

  // Build the HTML for each task card dynamically
  tasks.forEach((task) => {
    html += `
      <div class="task-card" data-id="${task.id}">
        <div class="task-top-row">
          <span class="task-name">${task.name}</span>
          <span class="priority-pill priority-${task.priority.toLowerCase()}">
            ${task.priority} priority
          </span>
        </div>
        <div class="task-meta-row">
          <div class="task-meta-left">
            <span class="task-date">Added: ${task.date}</span>
            ${task.isImportant ? '<span class="task-important-label">Important</span>' : ""}
          </div>
          <div class="task-controls">
            <label>
              <input
                type="checkbox"
                class="task-completed-checkbox"
                ${task.isCompleted ? "checked" : ""}
              >
              Completed
            </label>
            <button type="button" class="delete-task-btn">Delete</button>
          </div>
        </div>
      </div>
    `;
  });

  // Insert the tasks HTML into the container
  container.innerHTML = html;

  // Apply required JavaScript styling (important + completed)
  tasks.forEach((task) => {
    const card = container.querySelector(`.task-card[data-id="${task.id}"]`);
    if (!card) return;

    // Highlight important tasks in red (required by project specs)
    if (task.isImportant) {
      card.style.borderColor = "red";
      card.style.boxShadow = "0 0 0 1px rgba(239,68,68,0.4)";
    } else {
      // Default border for normal tasks
      card.style.borderColor = "#374151";
      card.style.boxShadow = "none";
    }

    // Apply strikethrough for completed tasks
    const nameEl = card.querySelector(".task-name");
    if (nameEl) {
      if (task.isCompleted) {
        nameEl.style.textDecoration = "line-through";
        nameEl.style.opacity = "0.6";
      } else {
        nameEl.style.textDecoration = "none";
        nameEl.style.opacity = "1";
      }
    }
  });
}

// Handles adding a new task from the form
function handleAddTask(event) {
  event.preventDefault(); // Prevent form from refreshing page

  const nameInput = document.getElementById("taskName");
  const prioritySelect = document.getElementById("taskPriority");
  const importantCheckbox = document.getElementById("taskImportant");
  const completedCheckbox = document.getElementById("taskCompleted");
  const errorMessage = document.getElementById("formError");

  const name = nameInput.value.trim();

  // Prevent empty task names (required by project specs)
  if (!name) {
    if (errorMessage) {
      errorMessage.textContent = "Please enter a task name.";
    }
    return;
  }

  // Clear error if name is valid
  if (errorMessage) {
    errorMessage.textContent = "";
  }

  const priority = prioritySelect.value;
  const isImportant = importantCheckbox.checked;
  const isCompleted = completedCheckbox.checked;

  const now = new Date();

  // Create the new task object using required structure
  const newTask = {
    id: Date.now(), // unique task ID
    name: name,
    priority: priority,
    isImportant: isImportant,
    isCompleted: isCompleted,
    date: now.toLocaleString() // required date field
  };

  // Add the new task to the task array
  tasks.push(newTask);

  // Reset form fields after submission
  event.target.reset();

  // Re-render the task list and log the updated tasks
  renderTasks();
  logTasks();
}

// Deletes a task by filtering it from the tasks array
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
  logTasks();
}

// Updates completion status when checkbox is clicked
function toggleTaskCompletion(taskId, isCompleted) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  task.isCompleted = isCompleted;
  renderTasks();
  logTasks();
}

// Sets up all event listeners once the page loads
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  const taskContainer = document.getElementById("taskmanager");

  // Form submit handler for adding tasks
  if (form) {
    form.addEventListener("submit", handleAddTask);
  }

  // Use event delegation for delete buttons and checkboxes
  if (taskContainer) {
    taskContainer.addEventListener("click", (event) => {
      const target = event.target;
      const card = target.closest(".task-card");
      if (!card) return;

      const id = Number(card.getAttribute("data-id"));

      // Detect delete button
      if (target.classList.contains("delete-task-btn")) {
        deleteTask(id);
      }
    });

    // Detect completion checkbox changes
    taskContainer.addEventListener("change", (event) => {
      const target = event.target;
      if (!target.classList.contains("task-completed-checkbox")) return;

      const card = target.closest(".task-card");
      if (!card) return;

      const id = Number(card.getAttribute("data-id"));
      toggleTaskCompletion(id, target.checked);
    });
  }

  // Render empty state on initial page load
  renderTasks();
});
