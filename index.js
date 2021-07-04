const express = require("express");
const router = require("./routes/routes");
const PORT = process.env.PORT || 80;
const app = express();
 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/",router);


app.listen(PORT, err => { err ? console.error(err) : console.log("Servidor rodando") });