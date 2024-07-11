const express = require('express')
const app = express()
const path = require('path');

const user=require("./routes/userroute.js")
const cookieParser=require('cookie-parser')
const errorMiddleware=require("./middleware/error.js")

const cors = require('cors');
app.use(express.static(path.join(__dirname, 'public')));
// Enable CORS for all routes
app.use(cors());
app.use(express.json())
app.use(cookieParser())
app.get('/')
app.use("/api/v1",user);
app.use(errorMiddleware)

module.exports=app
