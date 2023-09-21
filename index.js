import connectDB from "./db.js";
import Express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { noteRouter } from "./routes/notes.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const app = Express();
const port = process.env.PORT;

connectDB();
app.use(cors({
  origin: ["http://localhost:3000/", "https://inotes.onrender.com"]
}));
app.use(Express.json());
app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);

app.listen(port, () => {
  console.log("Example app listening on port");
});
