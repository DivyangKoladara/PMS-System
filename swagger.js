const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
      version: '1.0.0',      // by default: '1.0.0'
      title: 'Project Management System',        // by default: 'REST API'
      description: '',  // by default: ''
    },
    host: 'firstapipms.herokuapp.com',      // by default: 'localhost:3000'
    basePath: '/',  // by default: '/'
    schemes: ['http','https'],   // by default: ['http']
    consumes: ['application/json'],  // by default: ['application/json']
    produces: ['application/json'],  // by default: ['application/json']
    // tags: [        // by default: empty Array
    //   {
    //     name: 'Divyang',         // Tag name
    //     description: 'how to manage you project',  // Tag description
    //   },
    //   // { ... }
    // ],
    // securityDefinitions: {},  // by default: empty object
    // definitions: {},          // by default: empty object (Swagger 2.0)
    // components: {}            // by default: empty object (OpenAPI 3.x)
  };


const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc)
.then(()=>{console.log("connected");})
.catch(err =>{ console.log("err",err)})














