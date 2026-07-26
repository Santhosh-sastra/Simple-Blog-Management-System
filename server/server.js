const express = require("express");
const app = express();
const PORT = 5000;
app.use(express.json());
const blogs = [];
app.get("/", (req, res) => {
  res.send("Simple Blog server is running!");
});
app.get("/api/blogs", (req, res) => {
  res.status(200).json(blogs);
});
app.post("/api/blogs", (req, res) => {
  const { title, author, content } = req.body;
  if (!title || !author || !content) {
    return res.status(400).json({
      message: "Title, author, and content are required.",
    });
  }
  const newBlog = {
    id: Date.now(),
    title,
    author,
    content,
    createdAt: new Date().toISOString(),
  };
  blogs.push(newBlog);
  res.status(201).json({
    message: "Blog created successfully!",
    blog: newBlog,
  });
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
