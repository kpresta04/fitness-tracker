const express = require("express");
const mongojs = require("mongojs");
const mongoose = require("mongoose");
const Workout = require("./models/Workout");
const workoutSeed = require("./seeders/seed");
const connectDB = require("./config/db");
const logger = require("morgan");
const path = require("path");

const app = express();

connectDB();
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const seed = async () => {
	try {
		await Workout.deleteMany({});

		// await Workout.insertMany(workoutSeed);
		const documents = await Workout.find({});
		console.log(documents);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

seed();

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/public/index.html"));
});
app.get("/exercise", (req, res) => {
	res.sendFile(path.join(__dirname + "/public/exercise.html"));
});
app.get("/stats", (req, res) => {
	res.sendFile(path.join(__dirname + "/public/stats.html"));
});

app.get("/api/workouts", (req, res) => {
	res.json(Workout.find({}));
});

app.post("/submit", (req, res) => {
	console.log(req.body);

	db.notes.insert(req.body, (error, data) => {
		if (error) {
			res.send(error);
		} else {
			res.send(data);
		}
	});
});

app.get("/all", (req, res) => {
	db.notes.find({}, (error, data) => {
		if (error) {
			res.send(error);
		} else {
			res.json(data);
		}
	});
});

app.get("/find/:id", (req, res) => {
	db.notes.findOne(
		{
			_id: mongojs.ObjectId(req.params.id),
		},
		(error, data) => {
			if (error) {
				res.send(error);
			} else {
				res.send(data);
			}
		}
	);
});

app.post("/update/:id", (req, res) => {
	db.notes.update(
		{
			_id: mongojs.ObjectId(req.params.id),
		},
		{
			$set: {
				title: req.body.title,
				note: req.body.note,
				modified: Date.now(),
			},
		},
		(error, data) => {
			if (error) {
				res.send(error);
			} else {
				res.send(data);
			}
		}
	);
});

app.delete("/delete/:id", (req, res) => {
	db.notes.remove(
		{
			_id: mongojs.ObjectID(req.params.id),
		},
		(error, data) => {
			if (error) {
				res.send(error);
			} else {
				res.send(data);
			}
		}
	);
});

app.delete("/clearall", (req, res) => {
	db.notes.remove({}, (error, response) => {
		if (error) {
			res.send(error);
		} else {
			res.send(response);
		}
	});
});

app.listen(3000 || process.env.PORT, () => {
	console.log("App running on port 3000!");
});
