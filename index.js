import express from "express";
import bodyParser from "body-parser";

var blogs = [];

const app = express();
const port = 3000;
var id = 0;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { blogs: blogs });
});

app.get("/create", (req, res) => {
  res.render("create.ejs");
});

app.post("/submit", (req, res) => {
  req.body.date = formatDate();
  //NEW ID
  if (req.body.id == undefined) {
    req.body.id = id;
    id++;
    console.log(req.body);
    blogs.push(req.body);
  } //Editing
  else {
    console.log(`old id: ${req.body.id}`);
    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].id == req.body.id) {
        blogs[i] = req.body;
      }
    }
  }

  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const blogId = req.body.id;

  deleteIDfromBlog(blogId);

  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const blogId = req.body.id;

  console.log(blogId);
  let reqdBlog = getBlog(blogId);

  res.render("create.ejs", { blog: reqdBlog });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

function formatDate() {
  const now = new Date(); // Get the current date
  let day = now.getDate(); // Get the day of the month
  let month = now.getMonth() + 1; // Get the month (0-based index, so add 1)
  let year = now.getFullYear(); // Get the full year

  // Pad single-digit day and month with leading zeros
  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;

  return `${day}/${month}/${year}`;
}

function deleteIDfromBlog(blogID) {
  var indexToRemove;

  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].id == blogID) {
      indexToRemove = i;
      break;
    }
  }

  blogs.splice(indexToRemove, 1);
}

function getBlog(blogID) {
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].id == blogID) {
      return blogs[i];
    }
  }
}
