
// ===============================
// 1. Dark and light theme
// ===============================
const themeToggle = document.getElementById("themeToggle");

function updateThemeButton() {
    const isLight = document.body.classList.contains("light-theme");

    themeToggle.textContent = isLight ? "🌙" : "☀️";
    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
    );
}

// Load saved theme, if one exists.
try {
    if (localStorage.getItem("portfolio-theme") === "light") {
        document.body.classList.add("light-theme");
    }
} catch (error) {
    // The site still works if browser storage is unavailable.
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    const theme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";

    try {
        localStorage.setItem("portfolio-theme", theme);
    } catch (error) {
        // Theme switching still works for the current page.
    }

    updateThemeButton();
});

// ===============================
// 2. Mobile navigation menu
// ===============================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

// ===============================
// 3. Project details popup
// ===============================
const projectDialog = document.getElementById("projectDialog");
const dialogClose = document.getElementById("dialogClose");
const dialogTitle = document.getElementById("dialogTitle");
const dialogDescription = document.getElementById("dialogDescription");
const dialogTech = document.getElementById("dialogTech");

const projectInfo = {
    hospital: {
        title: "Hospital Management System",
        description:
            "A PHP and MySQL-based academic web application concept for managing hospital records, users and appointment workflows. Update this description to match the features you have actually implemented.",
        tech: "PHP · MySQL · HTML · CSS · JavaScript"
    },

    hotel: {
        title: "Cox Hotel Management",
        description:
            "A C# Windows Forms project connected to a database, focused on hotel management workflows. Add the specific modules and functionality you built.",
        tech: "C# · Windows Forms · Database"
    },

    restaurant: {
        title: "Restaurant Management",
        description:
            "A Java academic project exploring restaurant operations and object-oriented programming. Add your actual features and screenshots.",
        tech: "Java · OOP"
    },

    railway: {
        title: "Railway Station Visualization",
        description:
            "A computer graphics project using OpenGL and GLUT to visualize a railway station scene. Add the details of your implementation.",
        tech: "C++ · OpenGL · GLUT"
    }
};

document.querySelectorAll(".project-details").forEach((button) => {
    button.addEventListener("click", () => {
        const project = projectInfo[button.dataset.project];

        if (!project) return;

        dialogTitle.textContent = project.title;
        dialogDescription.textContent = project.description;
        dialogTech.textContent = "Technologies: " + project.tech;

        if (typeof projectDialog.showModal === "function") {
            projectDialog.showModal();
        }
    });
});

dialogClose.addEventListener("click", () => {
    projectDialog.close();
});

// Close the dialog when the user clicks outside its content.
projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) {
        projectDialog.close();
    }
});

// ===============================
// 4. Update footer year
// ===============================
const footerText = document.querySelector(".footer-inner p");

if (footerText) {
    footerText.textContent =
        `Designed and developed by Jenifa Akter · ${new Date().getFullYear()}`;
}
