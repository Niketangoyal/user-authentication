const app=require("./app")
const dotenv=require("dotenv")
const connectDatabase=require('./config/database.js')

//config
dotenv.config({path:"config/config.env"})
connectDatabase()

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
  })