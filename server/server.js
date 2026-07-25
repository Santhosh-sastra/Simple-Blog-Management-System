const express = require("express");
const app = express();
const PORT = 5000;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Simple Blog server is running!");
});

/* GET route: will return all blogs later */
app.get("/api/blogs", (req, res) => {
  res.status(200).json({
    message: "GET route is working. Blog posts will be returned here.",
  });
});

/* POST route: will save blogs on Day 6 */
app.post("/api/blogs", (req, res) => {
  const { title, author, content } = req.body;

  res.status(201).json({
    message: "POST route is working.",
    receivedBlog: {
      title,
      author,
      content,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
