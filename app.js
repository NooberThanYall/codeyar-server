// import express, { json } from 'express';
// import { connect } from 'mongoose';
// import morgan from 'morgan';
// import cors from 'cors';

// import authRoutes from './routes/authRoutes.js';
// import snippetRoutes from './routes/snippetRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import statRoutes from './routes/app/statRoutes.js';
// import planRoutes from './routes/purchase/planRoutes.js';
import { configDotenv } from 'dotenv';
// import cookieParser from 'cookie-parser';
import cookieParser from "cookie-parser";
import { json } from "express";
import express from "express";
import morgan from "morgan";
import allRoutes from "./routes/routes.js";
import mongoose from "mongoose";
import http from "http";
import cors from 'cors';


class Application {
  #app = express();
  #PORT;
  #DB_URI;
  
  constructor(DB_URI, PORT) {
    this.#PORT = PORT;
    this.#DB_URI = DB_URI;
    this.configureAplication();
    this.connectDB();
    this.createServer();
    this.createRoute();
    configDotenv();
  }
  
  configureAplication() {
    const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
    this.#app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
      })
    );
    this.#app.use(json());
    this.#app.use(morgan("dev"));
    this.#app.use(cookieParser());
  }
  
  connectDB() {
    //   handle the connection to mongoose if some thing happens like crash should db close on exit
    mongoose.connect(this.#DB_URI);
    // listen on error
    mongoose.connection.on("error", (err) => {
      console.log(err);
      process.exit(1);
    });
    // listen on connection and print connected message
    mongoose.connection.on("connected", (data) => {
      console.log("connected to DB");
    });
    // on SIGINT signal exist
    process.on("SIGINT", () => {
      mongoose.connection.close(() => {
        console.log("Mongoose disconnected on app termination");
        process.exit(0);
      });
    });
  }
  
  createServer() {
    http.createServer(this.#app).listen(this.#PORT);
    if (process.env.app_state == "dev") {
      console.log(`run on > http://localhost:${this.#PORT}`);
    }
  }
  
  createRoute() {
    this.#app.use("/", allRoutes);
  }
}

export default Application;

// configDotenv();

// const app = express();

// // Middleware
// const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));

// app.use(json());
// app.use(morgan('dev'));
// app.use(cookieParser());

// // MongoDB connection
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codeyar';
// connect(MONGO_URI)
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// app.use('/auth', authRoutes);
// app.use('/snippet', snippetRoutes);
// app.use('/user', userRoutes);
// app.use('/stats', statRoutes);
// app.use('/plan', planRoutes)
// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//    console.log(`Server running on port ${PORT}`);
// });

// export default app;