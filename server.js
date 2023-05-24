const express = require('express')
const Router = require('./routes/routes.js')
const errorHandler = require('./middlewares/errorHandler.js')
const app = express()
const port = process.env.PORT || 4000
const connectDB = require('./db/connectDB.js')
const cors = require('cors')
const cookieParser = require('cookie-parser')


//app.use(cors({origin: ['http://localhost:5173/','frontenddeplayhost']}))

connectDB()

//generell middleware
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_DEV, process.env.FRONTEND_DEPLOYED],
  credentials: true,
  optionSuccessStatus:200
}))
app.use(cookieParser())

//Routes
app.use('/', Router)

//Error handling
app.use(errorHandler)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
