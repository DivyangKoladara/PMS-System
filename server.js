const express = require("express");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(cors());
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerDocument));

mongoose.connect(process.env.MONGO_URL,
    { 
        
        useNewUrlParser: true, 
        useUnifiedTopology: true ,

    }).then(console.log("Database connected successfully...")).catch(error=>{console.log(error);});




app.use('/upload',express.static('upload'));

app.use(express.json());

app.use('/',require('./controller/users/index'))

app.use('/',require('./controller/createproject/index'))

app.use('/taskreport',require('./controller/task/index'))

app.listen(port,()=>{console.log(`Server Stated on port ${port}`)})


