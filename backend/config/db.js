import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = mongoose
 .connect(process.env.MONGO_URI)
 .then(() => {
  console.log("connected to mongodb`");
 })
 .catch((err) => {
  console.log("err");
 });

mongoose.connection.on("disconnected", () => {
 console.log("warning disconnected");
});

export default connectDB;
