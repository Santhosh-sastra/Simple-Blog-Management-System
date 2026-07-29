const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(express.json());

/* Serves the client folder at http://localhost:5000 */
app.use(express.static(path.join(__dirname, "../client")));

/* Temporary storage */
const blogs = [];
const contactMessages = [];

/* View all blogs */
app.get("/api/blogs", (req, res) => {
  res.status(200).json(blogs);
});

/* Create a blog */
app.post("/api/blogs", (req, res) => {
  const { title, author, content } = req.body;

  if (!title || !author || !content) {
    return res.status(400).json({
      message: "Title, author, and content are required.",
    });
  }

  const newBlog = {
    id: Date.now(),
    title: title.trim(),
    author: author.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  blogs.push(newBlog);

  res.status(201).json({
    message: "Blog created successfully!",
    blog: newBlog,
  });
});

/* Edit an existing blog */
app.put("/api/blogs/:id", (req, res) => {
  const blogId = Number(req.params.id);
  const { title, author, content } = req.body;

  const blogIndex = blogs.findIndex((blog) => blog.id === blogId);

  if (blogIndex === -1) {
    return res.status(404).json({
      message: "Blog not found.",
    });
  }

  if (!title || !author || !content) {
    return res.status(400).json({
      message: "Title, author, and content are required.",
    });
  }

  blogs[blogIndex] = {
    ...blogs[blogIndex],
    title: title.trim(),
    author: author.trim(),
    content: content.trim(),
    updatedAt: new Date().toISOString(),
  };

  res.status(200).json({
    message: "Blog updated successfully!",
    blog: blogs[blogIndex],
  });
});

/* Delete an existing blog */
app.delete("/api/blogs/:id", (req, res) => {
  const blogId = Number(req.params.id);

  const blogIndex = blogs.findIndex((blog) => blog.id === blogId);

  if (blogIndex === -1) {
    return res.status(404).json({
      message: "Blog not found.",
    });
  }

  const deletedBlog = blogs.splice(blogIndex, 1);

  res.status(200).json({
    message: "Blog deleted successfully!",
    blog: deletedBlog[0],
  });
});

/* Save a contact message */
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "Name, email, and message are required.",
    });
  }

  const newMessage = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  contactMessages.push(newMessage);

  res.status(201).json({
    message: "Your message has been sent successfully!",
    contact: newMessage,
  });
});

/* View received contact messages */
app.get("/api/contact", (req, res) => {
  res.status(200).json(contactMessages);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
