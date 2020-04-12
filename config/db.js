const mongoose = require("mongoose");
const config = require("config");
const databaseUrl = process.env.MONGODB_URI || "mongodb://localhost/workouts";

// const db = config.get("mongoURI");

const connectDB = async () => {
	try {
		await mongoose.connect(databaseUrl, { useNewUrlParser: true });
		console.log("MongoDB connected");
	} catch (error) {
		console.log(error.mongoose);
		process.exit(1);
	}
};

module.exports = connectDB;
