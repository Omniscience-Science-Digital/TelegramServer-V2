const express = require('express')
const cors = require('cors')
const compression = require('compression')
const routes = require("./routes/api.route")
const app = express();

//Server Port 
const port = process.env.PORT || 8000;

// Trust the proxy
app.set('trust proxy', true);
app.use(express.json()); // Middleware to parse JSON bodies

//Enable Cors
app.use(cors({
    origin:'*',
    methods:'Get,POST',
    credentials:true
}))


//logging middleware 
app.use((req,res,next)=>{
    const start =Date.now();
    next()
    //after all action in the middleware
    const delta = Date.now() -start;
    console.log(`Execution time :  ${req.method}   ${req.url}    ${delta}   ms`)
})

// Routes
app.use('/', routes);

//json compression
app.use(compression());


//Parse URL-encoded bodies
app.use(express.urlencoded({extended:true}))


//Error handling middleware

app.use((err,req,res,next)=>{
    console.log(err.stack)
    res.status(500).send('Something went wrong !')
})


app.listen(port,()=>{
    console.log(`Running on port : ${port}`)
})



