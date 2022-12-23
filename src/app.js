import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoutes from "./routes/Auth.routes.js";
import UrlRoutes from "./routes/Url.routes.js"
import UserRoutes from "./routes/User.routes.js"
import RankingRoutes from "./routes/Ranking.routes.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(AuthRoutes);
app.use(UrlRoutes);
app.use(UserRoutes);
app.use(RankingRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));