import mongoose from "mongoose";
import { Server } from "http";
import 'dotenv/config'
import app from "./app";

const port = process.env.PORT || 5000;
let server:Server;
async function main() {
  try {
     await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qhz4s.mongodb.net/LMS-server?retryWrites=true&w=majority&appName=Cluster0`);
    console.log("LMS server Connected to MongoDB");
    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to database", err);
  }
}

main();