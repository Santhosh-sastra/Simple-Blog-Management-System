document.addEventListener("DOMContentLoaded", () => {
  const isGitHubPages = window.location.hostname.endsWith("github.io");

  const API_URL = isGitHubPages ? null : "/api/blogs";
  const CONTACT_API_URL = isGitHubPages ? null : "/api/contact";

  async function getJSON(response, fallbackMessage) {
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      throw new Error(fallbackMessage);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || fallbackMessage);
    }

    return data;
  }

  /* Theme toggle */
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-theme");
    }

    function updateThemeButton() {
      const isDark = document.body.classList.contains("dark-theme");

      document.documentElement.classList.toggle("dark-page", isDark);

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

  /* Add Blog form */
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

      if (!API_URL) {
        formMessage.style.color = "#f59e0b";
        formMessage.textContent =
          "This is a frontend demo. Publishing works in the local Express version.";
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

        await getJSON(response, "Unable to publish the blog.");

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

  /* Home page: view, edit, and delete blogs */
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
      const blogs = await getJSON(response, "Unable to load blogs.");

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
                <button type="button" class="edit-button" data-id="${blog.id}">
                  Edit
                </button>
                <button type="button" class="delete-button" data-id="${blog.id}">
                  Delete
                </button>
              </div>
            </article>
          `;
        })
        .join("");
    } catch (error) {
      emptyMessage.textContent = error.message;
    }
  }

  if (blogList) {
    if (!API_URL) {
      emptyMessage.textContent =
        "This is a frontend demo. Blog features work in the local Express version.";
    } else {
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

            await getJSON(response, "Unable to delete the blog.");
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

          const paragraphs = card.querySelectorAll("p");
          const currentContent = paragraphs[1].textContent;

          const updatedTitle = prompt("Edit blog title:", currentTitle);
          if (updatedTitle === null) return;

          const updatedAuthor = prompt("Edit author name:", currentAuthor);
          if (updatedAuthor === null) return;

          const updatedContent = prompt("Edit blog content:", currentContent);
          if (updatedContent === null) return;

          if (
            updatedTitle.trim().length < 5 ||
            updatedAuthor.trim().length < 2 ||
            updatedContent.trim().length < 20
          ) {
            alert(
              "Title needs 5+ characters, author needs 2+, and content needs 20+.",
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
                title: updatedTitle.trim(),
                author: updatedAuthor.trim(),
                content: updatedContent.trim(),
              }),
            });

            await getJSON(response, "Unable to update the blog.");

            alert("Blog updated successfully!");
            loadBlogs();
          } catch (error) {
            alert(error.message);
          }
        }
      });
    }
  }

  /* Contact form */
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

      if (!CONTACT_API_URL) {
        contactMessage.style.color = "#f59e0b";
        contactMessage.textContent =
          "This is a frontend demo. Contact messages work in the local Express version.";
        return;
      }

      try {
        const response = await fetch(CONTACT_API_URL, {
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

        await getJSON(response, "Unable to send the message.");

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
