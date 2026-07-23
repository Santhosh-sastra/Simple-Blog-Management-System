document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");

  if (!themeToggle) {
    console.log("Theme button was not found.");
    return;
  }

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }

  function updateThemeButton() {
    const isDark = document.body.classList.contains("dark-theme");

    themeToggle.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    const currentTheme = document.body.classList.contains("dark-theme")
      ? "dark"
      : "light";

    localStorage.setItem("theme", currentTheme);
    updateThemeButton();
  });

  updateThemeButton();
});
