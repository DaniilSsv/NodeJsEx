const swaggerAutogen = require('swagger-autogen')();
 
const doc = {
    info: {
        title: 'Rocket-api',
        description: 'API Documentation for Rocket API',
    },
    host: "myrocketapp-34740598b7f1.herokuapp.com",
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    apis: ["./routes/*.js"],
    definitions: {
        Token: {
            token: 'string',
        },
        Error: {
            msg: 'string',
        },
        Agency: {
            name:'string',
            location:'string',
            contactEmail:'string',
            establishedYear: 'integer',
            completedLaunches: 'integer',
            failedLaunches: 'integer',
        }, 
        LandingPad: {
            name: 'string',
            rocketId: 'ObjectId',
            location: 'string',
            surfaceType: 'string',
        }, 
        Rocket: {
            name: 'string',
            agencyId: 'ObjectId',
            payloadCapacity: 'integer',
            fuelType:'string',
            launchDate: 'date',
        }
    }
};
 
const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js']
 
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation has been generated.');
});