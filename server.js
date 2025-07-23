import dotenv from "dotenv";
dotenv.config();

import Application from "./app.js"; 

new Application(process.env.MONGO_URI, process.env.PORT || 5000);
