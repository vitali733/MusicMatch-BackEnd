const express = require('express')
const Router = require('./routes/routes.js')
const errorHandler = require('./middlewares/errorHandler.js')
const app = express()
const port = process.env.PORT || 4000
const connectDB = require('./db/connectDB.js')
const cors = require('cors')
const cookieParser = require('cookie-parser')


connectDB()

//generell middleware
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_DEV, process.env.FRONTEND_DEPLOYED,
    /https:\/\/music-match1\.netlify\.app/],
  credentials: true
  //optionSuccessStatus:200
}))
app.use(cookieParser())


//Routes
app.use('/', Router)

//Error handling
app.use(errorHandler)

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
