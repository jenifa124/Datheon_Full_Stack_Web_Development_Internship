# Dynamic Task Manager & Productivity Tracker (CRUD)

A responsive task management application built with HTML, CSS, and vanilla JavaScript. It allows users to manage daily tasks and track their productivity. Tasks are saved in the browser's `localStorage`, so they remain available after a page reload.

## Features

- Create, view, update, and delete tasks (CRUD)
- Organize tasks into Work, Personal, and Study categories
- Set optional due dates for tasks
- Mark tasks as completed or active
- Filter tasks by All, Active, or Completed
- Search tasks by task name or category
- Save task data using browser `localStorage`
- Responsive layout for desktop and mobile devices
- Completion progress indicator

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage

## Project Structure

```text
dynamic-task-manager/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run the Project

1. Download or clone this repository.
2. Open the project folder.
3. Open `index.html` in a web browser.
4. Add a task using the form.
5. Manage your tasks using the available features.

No server, package installation, or external dependency is required.

## Data Storage

Tasks are stored in the browser under the localStorage key:

```text
dynamicTaskManagerTasks
```

Task data is specific to the browser and device being used. Clearing the browser's site data may remove saved tasks.

## Deployment

The project can be deployed using Vercel by importing the GitHub repository.

After deployment, open the generated Vercel URL to access the application online.

## Author

**Most. Jenifa Akter**

## License

This project is available for educational and personal use.
