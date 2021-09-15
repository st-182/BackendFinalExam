// importing npm modules using ES6
import axios from "axios";
import cors from "cors";
import express from "express";

//Middleware
const app = express();
app.use(cors());
app.use(express.json());

//Logic
const allJokes = [];
let howManyJokesAvailable;
axios.get("https://api.chucknorris.io/jokes/search?query=all").then((data) => {
  howManyJokesAvailable = data.data.total;
  data.data.result.forEach((item) => {
    allJokes.push(item.value);
  });
});

//! GET
//simple check
app.get("/", (req, res) => res.json("API is running!..."));
//10 random jokes
app.get("/api/jokes/", (req, res) => {
  const random = Math.floor(Math.random() * howManyJokesAvailable - 10);
  res.json(allJokes.slice(random, random + 10));
});

app.get("/api/jokes/:amount", (req, res, next) => {
  //category of jokes amount
  const howManyJokesToShow = req.params.amount;

  if (+howManyJokesToShow || +howManyJokesToShow === 0) {
    if (
      howManyJokesToShow > howManyJokesAvailable ||
      +howManyJokesToShow < 0 ||
      +howManyJokesToShow === 0
    ) {
      res
        .status(500)
        .send(`Wrong request, min is 0, max is ${howManyJokesAvailable}`);
      return;
    }
    // const random = Math.floor(Math.random() * howManyJokesAvailable - 10);
    res.json(allJokes.slice(0, howManyJokesToShow));
  }
  next();
});

app.get("/api/jokes/:category", async (req, res) => {
  const category = req.params.category;
  if (typeof category === "string") {
    if (
      category === "animal" ||
      category === "career" ||
      category === "celebrity" ||
      category === "dev" ||
      category === "explicit" ||
      category === "fashion" ||
      category === "food" ||
      category === "history" ||
      category === "money" ||
      category === "movie" ||
      category === "music" ||
      category === "political" ||
      category === "religion" ||
      category === "science" ||
      category === "sport" ||
      category === "travel"
    ) {
      const tenCategoryJokes = [];
      for (let i = 0; i < 10; i++) {
        await axios
          .get(`https://api.chucknorris.io/jokes/random?category=${category}`)
          .then((data) => {
            data.data.value ? tenCategoryJokes.push(data.data.value) : null;
          });
      }
      res.json(tenCategoryJokes);
    } else {
      res.status(500).json({
        answer: `Wrong request, use one of these categories:`,
        categories: [
          "animal",
          "career",
          "celebrity",
          "dev",
          "explicit",
          "fashion",
          "food",
          "history",
          "money",
          "movie",
          "music",
          "political",
          "religion",
          "science",
          "sport",
          "travel",
        ],
      });
      return;
    }
  }
});
app.get("/api/jokes/:category/:amount", async (req, res) => {
  const category = req.params.category;
  const howManyJokesInCategory = req.params.amount;
  if (typeof category === "string" && howManyJokesInCategory > 0) {
    if (
      category === "animal" ||
      category === "career" ||
      category === "celebrity" ||
      category === "dev" ||
      category === "explicit" ||
      category === "fashion" ||
      category === "food" ||
      category === "history" ||
      category === "money" ||
      category === "movie" ||
      category === "music" ||
      category === "political" ||
      category === "religion" ||
      category === "science" ||
      category === "sport" ||
      category === "travel"
    ) {
      const tenCategoryJokes = [];
      for (let i = 0; i < howManyJokesInCategory; i++) {
        await axios
          .get(`https://api.chucknorris.io/jokes/random?category=${category}`)
          .then((data) => {
            data.data.value ? tenCategoryJokes.push(data.data.value) : null;
          });
      }
      res.json(tenCategoryJokes);
    } else {
      res.status(500).send("Wrong request");
      return;
    }
  } else {
    res.status(500).send("Wrong request");
    return;
  }
});

//Starting server
app.listen(5000, () => console.log(`Server is running on port 5000`));
