const express = require("express");

const router = express.Router();

//TODO: importar la ruta

const authRoutes = require ("./authRoutes");

router.use("/auth",authRoutes);


module.exports.router;