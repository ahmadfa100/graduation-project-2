import express from "express";
import cors from "cors";
import env from "dotenv";
import offersRoutes from "./Routes/offerRoutes.js";

env.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", offersRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
