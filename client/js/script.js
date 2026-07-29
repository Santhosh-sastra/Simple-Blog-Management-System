document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "/api/blogs";

  /* Theme toggle */
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

  /* Add Blog: POST request */
  const blogForm = document.getElementById("blogForm");

  if (blogForm) {
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const content = document.getElementById("content");
    const formMessage = document.getElementById("formMessage");

    blogForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const titleValue = title.value.trim();
      const authorValue = author.value.trim();
      const contentValue = content.value.trim();

      formMessage.style.color = "#dc2626";

      if (titleValue.length < 5) {
        formMessage.textContent =
          "Please enter a title with at least 5 characters.";
        title.focus();
        return;
      }

      if (authorValue.length < 2) {
        formMessage.textContent = "Please enter an author name.";
        author.focus();
        return;
      }

      if (contentValue.length < 20) {
        formMessage.textContent =
          "Blog content must contain at least 20 characters.";
        content.focus();
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: titleValue,
            author: authorValue,
            content: contentValue,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to publish the blog.");
        }

        formMessage.style.color = "#16a34a";
        formMessage.textContent =
          "Blog published successfully! Redirecting to the Home page...";

        blogForm.reset();

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1200);
      } catch (error) {
        formMessage.style.color = "#dc2626";
        formMessage.textContent = error.message;
      }
    });
  }

  /* Home page: GET, PUT, and DELETE requests */
  const blogList = document.getElementById("blogList");
  const emptyMessage = document.getElementById("emptyMessage");

  function escapeHTML(value) {
    const temporaryElement = document.createElement("div");
    temporaryElement.textContent = value;
    return temporaryElement.innerHTML;
  }

  async function loadBlogs() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load blogs.");
      }

      const blogs = await response.json();

      if (blogs.length === 0) {
        emptyMessage.textContent =
          "No blogs have been published yet. Be the first to write one!";
        blogList.innerHTML = "";
        return;
      }

      emptyMessage.textContent = "";

      blogList.innerHTML = blogs
        .map((blog) => {
          const date = new Date(blog.createdAt).toLocaleDateString();

          return `
            <article class="blog-card">
              <div class="card-tag">Published ${date}</div>
              <h3>${escapeHTML(blog.title)}</h3>
              <p class="blog-author">By ${escapeHTML(blog.author)}</p>
              <p>${escapeHTML(blog.content)}</p>

              <div class="blog-actions">
                <button class="edit-button" data-id="${blog.id}">
                  Edit
                </button>
                <button class="delete-button" data-id="${blog.id}">
                  Delete
                </button>
              </div>
            </article>
          `;
        })
        .join("");
    } catch (error) {
      emptyMessage.textContent =
        "Unable to load blogs. Please make sure the server is running.";
    }
  }

  if (blogList) {
    loadBlogs();

    blogList.addEventListener("click", async (event) => {
      const blogId = event.target.dataset.id;

      if (!blogId) {
        return;
      }

      /* Delete blog */
      if (event.target.classList.contains("delete-button")) {
        const shouldDelete = confirm(
          "Are you sure you want to delete this blog?",
        );

        if (!shouldDelete) {
          return;
        }

        try {
          const response = await fetch(`${API_URL}/${blogId}`, {
            method: "DELETE",
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Unable to delete the blog.");
          }

          loadBlogs();
        } catch (error) {
          alert(error.message);
        }
      }

      /* Edit blog */
      if (event.target.classList.contains("edit-button")) {
        const card = event.target.closest(".blog-card");
        const currentTitle = card.querySelector("h3").textContent;
        const currentAuthor = card
          .querySelector(".blog-author")
          .textContent.replace("By ", "");
        const currentContent = card.querySelector(
          "p:not(.blog-author)",
        ).textContent;

        const title = prompt("Edit blog title:", currentTitle);
        if (title === null) return;

        const author = prompt("Edit author name:", currentAuthor);
        if (author === null) return;

        const content = prompt("Edit blog content:", currentContent);
        if (content === null) return;

        if (
          title.trim().length < 5 ||
          author.trim().length < 2 ||
          content.trim().length < 20
        ) {
          alert(
            "Use a title of 5+ characters, author name of 2+ characters, and content of 20+ characters.",
          );
          return;
        }

        try {
          const response = await fetch(`${API_URL}/${blogId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: title.trim(),
              author: author.trim(),
              content: content.trim(),
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Unable to update the blog.");
          }

          loadBlogs();
        } catch (error) {
          alert(error.message);
        }
      }
    });
  }

  /* Contact form validation */
  /* Contact form: validate and send to Express */
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const contactMessage = document.getElementById("contactMessage");

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nameValue = name.value.trim();
      const emailValue = email.value.trim();
      const messageValue = message.value.trim();

      contactMessage.style.color = "#dc2626";

      if (nameValue.length < 2) {
        contactMessage.textContent = "Please enter your name.";
        name.focus();
        return;
      }

      if (!emailValue.includes("@")) {
        contactMessage.textContent = "Please enter a valid email address.";
        email.focus();
        return;
      }

      if (messageValue.length < 10) {
        contactMessage.textContent =
          "Your message must contain at least 10 characters.";
        message.focus();
        return;
      }

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nameValue,
            email: emailValue,
            message: messageValue,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to send the message.");
        }

        contactMessage.style.color = "#16a34a";
        contactMessage.textContent =
          "Thanks for reaching out! Your message was sent successfully.";

        contactForm.reset();
      } catch (error) {
        contactMessage.style.color = "#dc2626";
        contactMessage.textContent = error.message;
      }
    });
  }
});
