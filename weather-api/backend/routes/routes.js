import express from "express"
import getWeather from "../controllers/weather-controller.js";

const Router = express.Router();

Router.get("/get-weather", getWeather);

export default Router;