require('dotenv').config();
const express = require('express')
const cors = require('cors')


const app = express()




app.use(express.json())
app.use(express.urlencoded({ extended: true }))




const userRouter=require('./routes/UsersRouter.js')

app.use('/user', userRouter)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})