const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const Workout = require("./models/Workout");
const workoutSeed = require("./seeders/seed");
// const connectDB = require("./config/db");
const logger = require("morgan");
const path = require("path");
const mongojs = require("mongojs");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
const databaseUrl =
	"mongodb://dbUser:11223344A@ds011963.mlab.com:11963/heroku_hgsgk4nv";
// "mongodb+srv://dbUser:11223344@cluster0-l36fj.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(databaseUrl, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
})
	.then((client) => {
		const db = client.db("fitness-tracker");
		const workoutCollection = db.collection("workouts");

		const seed = async () => {
			try {
				await workoutCollection.deleteMany({});

				await workoutCollection.insertMany(workoutSeed);
			} catch (error) {
				console.log(error);
				process.exit(1);
			}
		};
		seed();
		app.get("/api/workouts", (req, res) => {
			workoutCollection.find().toArray(function (error, documents) {
				if (error) throw error;

				res.json(documents);
			});
		});

		app.delete("/api/clearall", (req, res) => {
			workoutCollection.deleteMany({}, (error, response) => {
				if (error) {
					res.send(error);
				} else {
					res.send(response);
				}
			});
		});
		app.delete("/api/delete/:id", (req, res) => {
			workoutCollection.deleteOne(
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
		app.put("/api/workouts/:id", (req, res) => {
			const newExercise = req.body;
			workoutCollection.update(
				{
					_id: mongojs.ObjectId(req.params.id),
				},
				{
					$set: {
						exercises: {
							$push: {
								...newExercise,
							},
						},
					},
				},
				(error, data) => {
					if (error) {
						res.send(error);
						console.log(newExercise);
					} else {
						console.log(newExercise);

						res.json(data);
					}
				}
			);
		});
		app.post("/api/workouts", (req, res) => {
			workoutCollection.insert(req.body, (error, data) => {
				if (error) {
					res.send(error);
				} else {
					res.send(data);
				}
			});
		});
	})
	.catch((err) => {
		console.log(err);
	});

// seed();

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/public/index.html"));
});
app.get("/exercise", (req, res) => {
	res.sendFile(path.join(__dirname + "/public/exercise.html"));
});
app.get("/stats", (req, res) => {
	res.sendFile(path.join(__dirname + "/public/stats.html"));
});

// app.get("/all", (req, res) => {
// 	db.notes.find({}, (error, data) => {
// 		if (error) {
// 			res.send(error);
// 		} else {
// 			res.json(data);
// 		}
// 	});
// });

// app.get("/find/:id", (req, res) => {
// 	db.notes.findOne(
// 		{
// 			_id: mongojs.ObjectId(req.params.id),
// 		},
// 		(error, data) => {
// 			if (error) {
// 				res.send(error);
// 			} else {
// 				res.send(data);
// 			}
// 		}
// 	);
// });

app.listen(3000 || process.env.PORT, () => {
	console.log("App running on port 3000!");
});
