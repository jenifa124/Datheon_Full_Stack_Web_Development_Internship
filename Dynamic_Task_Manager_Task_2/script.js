const STORAGE_KEY = "dynamicTaskManagerTasks";

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskCategory = document.getElementById("taskCategory");
const taskDueDate = document.getElementById("taskDueDate");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const taskCount = document.getElementById("taskCount");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-button");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

let tasks = loadFromLocalStorage();
let activeFilter = "All";
let searchTerm = "";

function loadFromLocalStorage() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    return [];
  }
}

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(title, category, dueDate) {
  return {
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    title: title.trim(),
    category,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString()
  };
}

function formatDueDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  return `Due ${date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
}

function renderTasks() {
  const normalizedSearch = searchTerm.toLowerCase();
  const visibleTasks = tasks.filter((task) => {
    const matchesStatus =
      activeFilter === "All" ||
      (activeFilter === "Active" && !task.completed) ||
      (activeFilter === "Completed" && task.completed);
    const matchesSearch =
      task.title.toLowerCase().includes(normalizedSearch) ||
      task.category.toLowerCase().includes(normalizedSearch);
    return matchesStatus && matchesSearch;
  });

  taskList.innerHTML = "";
  visibleTasks.forEach((task) => {
    const item = document.createElement("article");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.title} as ${task.completed ? "active" : "completed"}`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const main = document.createElement("div");
    main.className = "task-main";
    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;
    main.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "task-meta";
    const category = document.createElement("span");
    category.className = `category ${task.category}`;
    category.textContent = task.category;
    meta.appendChild(category);

    if (task.dueDate) {
      const due = document.createElement("span");
      due.className = "due";
      due.textContent = formatDueDate(task.dueDate);
      if (!task.completed && task.dueDate < new Date().toISOString().slice(0, 10)) {
        due.classList.add("overdue");
      }
      meta.appendChild(due);
    }
    main.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "task-actions";
    const editButton = document.createElement("button");
    editButton.className = "icon-button";
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "icon-button delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actions.append(editButton, deleteButton);
    item.append(checkbox, main, actions);
    taskList.appendChild(item);
  });

  emptyState.style.display = visibleTasks.length ? "none" : "block";
  emptyState.textContent = tasks.length
    ? "No tasks match your current filter."
    : "No tasks yet. Add your first task above.";
  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
  updateProgress();
}

function updateProgress() {
  const completed = tasks.filter((task) => task.completed).length;
  const percentage = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  progressText.textContent = `${percentage}% complete`;
  progressBar.style.width = `${percentage}%`;
}

function toggleTask(id) {
  tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
  saveToLocalStorage();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  const updatedTitle = prompt("Edit task name:", task.title);
  if (updatedTitle === null) return;
  if (!updatedTitle.trim()) {
    alert("Task name cannot be empty.");
    return;
  }
  const updatedCategory = prompt("Category: Work, Personal, or Study", task.category);
  if (updatedCategory === null) return;
  const validCategories = ["Work", "Personal", "Study"];
  const category = validCategories.find((value) => value.toLowerCase() === updatedCategory.trim().toLowerCase());
  if (!category) {
    alert("Please enter Work, Personal, or Study as the category.");
    return;
  }
  const updatedDueDate = prompt("Due date (YYYY-MM-DD), or leave blank:", task.dueDate || "");
  if (updatedDueDate === null) return;
  if (updatedDueDate && !/^\d{4}-\d{2}-\d{2}$/.test(updatedDueDate)) {
    alert("Please use the date format YYYY-MM-DD.");
    return;
  }

  tasks = tasks.map((item) => item.id === id
    ? { ...item, title: updatedTitle.trim(), category, dueDate: updatedDueDate }
    : item);
  saveToLocalStorage();
  renderTasks();
}

function deleteTask(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task || !confirm(`Delete "${task.title}"?`)) return;
  tasks = tasks.filter((item) => item.id !== id);
  saveToLocalStorage();
  renderTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskTitle.value.trim();
  if (!title) return;
  tasks.unshift(createTask(title, taskCategory.value, taskDueDate.value));
  saveToLocalStorage();
  taskForm.reset();
  taskTitle.focus();
  renderTasks();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderTasks();
  });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  renderTasks();
});

renderTasks();
