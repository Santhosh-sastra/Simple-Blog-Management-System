# Simple Blog Management System - Simple Blog

A full-stack blog application built as part of a 14-day Full Stack Development learning journey.

## Features

💠 Responsive Home, Add Blog, and Contact Me pages
💠 Light and dark mode
💠 Form validation using JavaScript and DOM events
💠 Create blog posts
💠 View all blog posts on the Home page
💠 Edit blog posts
💠 Delete blog posts
💠 Contact form connected to an Express API
💠 Animations, hover effects, and smooth scrolling
💠 GitHub Pages deployment for the frontend UI

## Technologies Used

💠 HTML5
💠 CSS3
💠 JavaScript
💠 Node.js
💠 Express.js
💠 Fetch API
💠 Git and GitHub

## Project Structure

```text
Fullstack-Day1/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── client/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   ├── js/
│   │   └── script.js
│   ├── index.html
│   ├── add-blog.html
│   └── contact.html
├── server/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── .gitignore
├── .gitattributes
└── README.md
```

## Run Locally

1. Clone the repository.

```bash
git clone https://github.com/Santhosh-sastra/Simple-Blog-Management-System.git
```

2. Go to the server folder.

```bash
cd server
```

3. Install dependencies.

```bash
npm install
```

4. Start the server.

```bash
node server.js
```

5. Open the project in a browser.

```text
http://localhost:5000/
```

## API Endpoints

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| GET    | `/api/blogs`     | Get all blog posts     |
| POST   | `/api/blogs`     | Create a blog post     |
| PUT    | `/api/blogs/:id` | Update a blog post     |
| DELETE | `/api/blogs/:id` | Delete a blog post     |
| GET    | `/api/contact`   | View contact messages  |
| POST   | `/api/contact`   | Send a contact message |

## Important Note

Blog posts and contact messages are currently stored in JavaScript arrays. They are temporary and disappear when the server restarts. A future version can use MongoDB for permanent storage.

The GitHub Pages site deploys the frontend UI only. The Express backend APIs require the local server to run or a separate backend hosting service.

## Author

Alapati Santhosh Kumar

## Learning Journey

This project was developed step by step through HTML, CSS, JavaScript, Express.js, REST APIs, Fetch API, GitHub Pages, responsive design, and performance cleanup.

## github-pages

https://santhosh-sastra.github.io/Simple-Blog-Management-System/

