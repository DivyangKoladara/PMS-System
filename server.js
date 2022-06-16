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

//routs

app.use('/',require('./controller/users/index'))
app.use('/',require('./controller/createproject/index'))
app.use('/taskreport',require('./controller/task/index'))
app.use('/',require('./controller/leave/index'))



// rout not found
app.post('/*',(req,res)=>{
    res.status(400).send({message:"Rout not found!"})
})

app.get('/*',(req,res)=>{
    res.status(400).send({message:"Rout not found!"})
})

app.delete('/*',(req,res)=>{
    res.status(400).send({message:"Rout not found!"})
})


app.put('/*',(req,res)=>{
    res.status(400).send({message:"Rout not found!"})
})

app.listen(port,()=>{console.log(`Server Stated on port ${port}`)})


