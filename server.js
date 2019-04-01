const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/users");

const isValidDate = d => {
  return d instanceof Date && !isNaN(d);
};

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", (req, res, next) => {
  let username = req.body.username;
  console.log(req.body);
  let user = new User({
    username: username
  });
  user
    .save()
    .then(user => {
      console.log(`${user.username} has been succesfully added to the DB`);
      return res.json(user);
    })
    .catch(err => console.log(err));
});

app.post("/api/exercise/add", (req, res, next) => {
  let userId = req.body.userId;
  let duration = req.body.duration;
  let description = req.body.description;
  let date = req.body.date ? new Date(req.body.date) : new Date();
  let exercise = {
    duration: duration,
    description: description,
    date: date
  };

  User.findOneAndUpdate({ _id: userId })
    .then(user => {
      user.exercises.push(exercise);
      user
        .save()
        .then(user => {
          console.log(
            `Exercise has been added successfully to ${user.username}`
          );
          return res.json({
            user: user.username,
            exerciseAdded: exercise
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

app.get("/api/exercise/log/:userId", (req, res, next) => {
  let from = new Date(req.query.from);
  let to = new Date(req.query.to);
  let userId = req.params.userId;
  let limit = parseInt(req.query.limit);
  console.log(limit);

  User.findById({ _id: userId })
    .then(user => {
      let exerciseList = user.exercises;

      if (isValidDate(to)) {
        exerciseList = exerciseList.filter(
          exercise => exercise.date >= from && exercise.date <= to
        );
      } else if (isValidDate(from)) {
        exerciseList = exerciseList.filter(exercise => exercise.date >= from);
      }
      if (!isNaN(limit) && exerciseList.length > limit) {
        exerciseList = exerciseList.slice(0, limit);
      }

      let response = {
        user: {
          id: user._id,
          username: user.username
        },
        exerciseCount: exerciseList.length,
        exercises: exerciseList
      };
      return res.json(response);
    })
    .catch(err => console.log(err));
});

app.get("/api/exercise/user", (req, res, next) => {
  User.find()
    .then(users => {
      console.log(users);
      let list = [];
      users.forEach(user => {
        list.push(user.username);
      });
      console.log(list);
      return res.json(list);
    })
    .catch(err => console.log(err));
});

const uri;//mongo db uri; 
mongoose
  .connect(uri, { dbName: "exerciseapi", useNewUrlParser: true })
  .then(res => {
    app.listen(3000, res => {
      console.log("Server running: 3000");
      console.log("Connected to the DB exerciseapi");
      mongoose.connection.db.c;
    });
  })
  .catch();
