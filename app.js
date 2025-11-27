const express = require("express");
const logger = require("morgan");
const bodyParser= require("body-parser");
const http = require("http");

require("dotenv").config();

const routes = require("./routes");

const app = express();
app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Ruta de prueba
/*app.get("/",(req,res)=> res.status(200).send({
    message: "Bienvenidos al mundo de las apis"
}),
);*/

//registro de rutas

app.use("/",routes);
const port= parseInt(process.env.PORT,10);
app.set("port",port);

const server = http.createServer(app);
server.listen(port,()=> console.log (`Servidor escuchando el puerto ${port}`));

module.exports=app;