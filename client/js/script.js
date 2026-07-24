document.addEventListener("DOMContentLoaded", () => {
  /* Light / dark mode */
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-theme");
    }

    function updateThemeButton() {
      const isDark = document.body.classList.contains("dark-theme");

      themeToggle.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
    }

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");

      const selectedTheme = document.body.classList.contains("dark-theme")
        ? "dark"
        : "light";

      localStorage.setItem("theme", selectedTheme);
      updateThemeButton();
    });

    updateThemeButton();
  }

  /* Add Blog form validation */
  const blogForm = document.getElementById("blogForm");

  if (blogForm) {
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const content = document.getElementById("content");
    const formMessage = document.getElementById("formMessage");

    blogForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const titleValue = title.value.trim();
      const authorValue = author.value.trim();
      const contentValue = content.value.trim();

      formMessage.style.color = "#dc2626";

      if (titleValue.length < 5) {
        formMessage.textContent =
          "Please enter a blog title with at least 5 characters.";
        title.focus();
        return;
      }

      if (authorValue.length < 2) {
        formMessage.textContent =
          "Please enter an author name with at least 2 characters.";
        author.focus();
        return;
      }

      if (contentValue.length < 20) {
        formMessage.textContent =
          "Blog content must contain at least 20 characters.";
        content.focus();
        return;
      }

      formMessage.style.color = "#16a34a";
      formMessage.textContent = "Blog validated successfully!";

      blogForm.reset();
    });

    function clearMessage() {
      formMessage.textContent = "";
    }

    title.addEventListener("input", clearMessage);
    author.addEventListener("input", clearMessage);
    content.addEventListener("input", clearMessage);
  }

  /* Contact form validation */
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const contactMessage = document.getElementById("contactMessage");

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (name.value.trim().length < 2) {
        contactMessage.style.color = "#dc2626";
        contactMessage.textContent = "Please enter your name.";
        name.focus();
        return;
      }

      if (!email.value.includes("@")) {
        contactMessage.style.color = "#dc2626";
        contactMessage.textContent = "Please enter a valid email address.";
        email.focus();
        return;
      }

      if (message.value.trim().length < 10) {
        contactMessage.style.color = "#dc2626";
        contactMessage.textContent =
          "Your message must contain at least 10 characters.";
        message.focus();
        return;
      }

      contactMessage.style.color = "#16a34a";
      contactMessage.textContent =
        "Thanks for reaching out! I will get back to you soon.";

      contactForm.reset();
    });
  }
});
