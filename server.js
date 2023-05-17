const express = require('express')
const userRoutes = require('./routes/userRoutes.js')
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
app.use(cors())
app.use(cookieParser())

//Routes
app.use('/users', userRoutes)

//Error handling
app.use(errorHandler)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
