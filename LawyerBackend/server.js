require('dotenv').config();
const express = require('express')
const cors = require('cors')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const app = express()

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Law Firm Web App Backend',
            version: '1.0.0',
            description: 'API documentation',
        },
    },
    apis: ['./models/*.js', './controllers/*.js','./controllers/Admin/*.js','./controllers/User/*.js'],
    servers: [
        {
            url: 'http://localhost:8080'
        }
    ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  };

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




const userRouter=require('./routes/UsersRouter.js')
const adminRouter=require('./routes/AdminRouter.js')

app.use('/user', userRouter)
app.use('/admin', adminRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
