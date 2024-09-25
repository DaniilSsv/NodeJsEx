require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const {authenticate} = require('./middleware/auth'); // Import the authenticateentication middleware

const app = express();

mongoose.set('strictPopulate', false);
const port = process.env.PORT;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to DB"));

// Middleware for parsing JSON request bodies
app.use(express.json());

// Redirect Base url to Documentation
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// authentication route
const authenticateRoutes = require('./routes/auth');
app.use('/api/auth', authenticateRoutes);

// Routes
app.use('/api/agencies', authenticate, require('./routes/agency')); // Protected agency routes
app.use('/api/landingpads', authenticate, require('./routes/landingPad')); // Protected landing pad routes
app.use('/api/rockets', authenticate, require('./routes/rocket')); // Protected rocket routes

// Swagger
const swaggerFile = require('./swagger-output.json');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
