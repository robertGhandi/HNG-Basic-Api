require("dotenv").config();
const cors = require("cors");
const axios = require("axios");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.use(cors());
app.set("trust proxy", true);

app.get("/api/hello", async (req, res) => {
	try {
		const visitorName = req.query.visitor_name || "Visitor";

		const clientIp =
			req.headers["x-forwarded-for"] || req.socket.remoteAddress;

		const cityResponse = await axios.get(
			`http://api.weatherapi.com/v1/ip.json?key=${WEATHER_API_KEY}&q=${clientIp}`
		);

		const city = cityResponse.data.city;

		const weatherResponse = await axios.get(
			`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`
		);
		const weatherData = weatherResponse.data;
		const temperature = weatherData.current.temp_c;

		const greeting = `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`;

		res.status(200).json({
			client_ip: clientIp,
			location: city,
			greeting: greeting,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			status: "Error",
			message: "unable to fetch data",
			details: error.message,
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
