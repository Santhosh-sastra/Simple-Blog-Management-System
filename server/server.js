const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(express.json());

/* Makes the client folder available at http://localhost:5000 */
app.use(express.static(path.join(__dirname, "../client")));

const blogs = [];

/* Get every saved blog */
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
