const express = require("express");
const http = require("http");
var employeeRouter = require('./routes/employeeRouter')
const port = 5000;


const app = express();
app.use(express.json());

app.use('/employee',employeeRouter);

app.use("/",function(req,res){
    res.send("Employee Api");
});

const server = http.createServer(app);
server.listen(port);
console.debug("Server listening ",port);