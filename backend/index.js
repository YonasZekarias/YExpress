require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const { connectRedis } = require("./config/redis");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const app = express();


connectDB();
connectRedis();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// Define routes here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});