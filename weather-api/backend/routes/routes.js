import express from "express"
import getWeather from "../controllers/weather-controller.js";

const Router = express.Router();

Router.get("/get-weather", getWeather);

Router.get("/health", (req, res) => {
    res.status(200).json({ message: "API is healthy" });
});

export default Router;