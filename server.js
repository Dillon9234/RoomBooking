const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { connectToDB } = require("./utils/database");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth/route");
const bookRoomRoute = require("./routes/bookroom/route");
const buildingRoute = require("./routes/building/route");
const bookingRoute = require("./routes/enquirerooms/route");
const getBookedRoomsRoute = require("./routes/getbookedrooms/route");
const roomsRoute = require("./routes/rooms/route");

const app = express();

const authenticate = (req, res, next) => {
  const token = req.cookies?.token;
  console.log(JSON.stringify(req.headers["Cookie"]));

  if (!token) {
    return res.status(403).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

connectToDB();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: "include",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/bookroom", authenticate, bookRoomRoute);
app.use("/api/building", buildingRoute);
app.use("/api/enquirerooms", authenticate, bookingRoute);
app.use("/api/getbookedrooms", authenticate, getBookedRoomsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.status(200).send("Status: OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
