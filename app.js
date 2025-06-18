// jshint esversion:9
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const { initSocketServer } = require('./services/sockets'); 
const app = express();
const server = http.createServer(app);

const authRoutes = require('./routes/auth/auth');
const dashRouts = require('./routes/dashboard/dash');

const errorHandler = require('./middlewares/errorhandler.js');


// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static("public/"));
const path = require('path');

// Serve static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: 'this is our little secret',
  resave: true,
  saveUninitialized: false
}));

app.use(flash());
app.get('/', (req, res) => {
  res.render('landing')
});

// Routes
app.use(authRoutes);
app.use(dashRouts);

// Error handling
app.use(errorHandler);

// Initialize the Socket.IO server
initSocketServer(server);

const io = require('./services/sockets').getSocketInstance();

const port = 4040;

const mongoUrl = 'mongodb+srv://joekingsleymukundi:Mukundijoe254@cluster0.dau9k.mongodb.net/mamary';
const dbConn = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoUrl);
    // Ensure Redis is connected before starting
    console.log('DB active');
  server.listen(port, () => {
    console.log(`Server live at port ${port}`);
  });
  } catch (error) {
    console.error(error);
  }
};

dbConn();
