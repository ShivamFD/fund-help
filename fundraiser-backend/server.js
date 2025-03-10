const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// Add this line after other route imports
app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/fundraisers", require("./routes/fundraiserRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
// app.use('/api/donations/webhook', express.raw({ type: 'application/json' }));
app.use("/api/fundraisers", require("./routes/fundraiserRoutes"));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
