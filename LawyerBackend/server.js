require('dotenv').config();
const express = require('express')
const cors = require('cors')


const app = express()

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  };

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))




const userRouter=require('./routes/UsersRouter.js')
const adminRouter=require('./routes/AdminRouter.js')

app.use('/user', userRouter)
app.use('/admin', adminRouter)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})