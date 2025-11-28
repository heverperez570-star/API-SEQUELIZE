
const jwt = require("jsonwebtoken");
const {request, response}= require("express");
const bcrypt = require("bcrypt");
const {StatusCodes} = require("http-status-codes");

require("dotenv").config();

const {Usuario, RefreshToken}= require ("./../models/index");

const { generateAccessToken, generateRefreshToken} = require("../utils/jwtUtils");

const {badRequestResponse,internalServerErrorResponse,unauthorizedResponse}= require("../utils/responseUtils");

const JWT_REFRESH_EXPIRATION_TIME = parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME) || 3600; //1 hora

const login = async (req=request, res=response)=>{
    const {email, password} = req.body;

    try {
        const user = await Usuario.findOne({where:{email}});
        if(!user){
            return badRequestResponse(res,"Usuario no encontrado.");
        }

        //verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return badRequestResponse(res, "Contraseña invalida.");
        }

        //Generación del AccesToken y el RefreshToken 
        const accesToken = generateAccessToken({id:user.id, email:user.email});
        const refreshToken =generateRefreshToken({id:user.id, email: user.email});

        //almacenar el refreshToken en la base de datos
        let expirationTime = new Date(Date.now()+1*(JWT_REFRESH_EXPIRATION_TIME*1000));

        await RefreshToken.create({
            refreshToken,
            usuarioId:user.id,
            issuedTime: new Date(),
            expirationTime,
        });

        return res.json({accesToken, refreshToken});
        
    } catch (error) {
        console.log(error);
        return internalServerErrorResponse(res, "Error al momento de iniciar sesión.");
    }
};

const register = async ( req=request, res=response)=>{
    const { username, email, password} = req.body;

    try {
        //verificar si el correo ya fue registrado
        const existingUser = await Usuario.findOne({where:{email}});
        if(existingUser){
            return badRequestResponse(res, "El correo ya está en uso. ")
        }

        //Encriptar la contraseña

        const hashedPassword = await bcrypt.hash(password,10);

        //Crear el usuario nuevo
        await Usuario.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(StatusCodes.CREATED).json({message: "Usuario creado exitosamente."});
    } catch (error) {
        console.log(error);
        return internalServerErrorResponse(res, "Error al momento de registrar el usuario.");
    }
};

const refreshAccessToken = async (req=request, res=response)=>{
    const {refreshToken} = req.body;

    //verificar si viene el refreshToken
    if(!refreshToken){
        return unauthorizedResponse(res," Refresh token no proporcionado.");

    }

    //Validaciones del refreshToken
    try {
    
        //verificar la firma del refreshToken
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        const refreshTokenInDb = await RefreshToken.findOne({where:{refreshToken}});
    
        if(!refreshTokenInDb){
            return unauthorizedResponse(res,"Refresh Token inválido o expirado.");
        }

        if(refreshTokenInDb.expirationTime < new Date()){
            await refreshTokenInDb.destroy();
            return unauthorizedResponse(res,"Refresh Token inválido o expirado.")
        }

        await RefreshToken.destroy({where: {usuarioId:payload.id}});
        const accesToken = generateAccessToken({
            id: payload.id,
            email:payload.email,
        });

        //Generar un nuevo RefreshToken

        const newRefreshToken = generateRefreshToken({
            id: payload.id,
            email: payload.email,
        });

         let expirationTime = new Date(Date.now()+1*(JWT_REFRESH_EXPIRATION_TIME*1000));

        await RefreshToken.create({
            refreshToken: newRefreshToken,
            usuarioId:payload.id,
            issuedTime: new Date(),
            expirationTime,
        });

        return res.json({accesToken, RefreshToken:newRefreshToken});
    
    } catch (error) {
        console.log(error);
        return unauthorizedResponse(res, "Refresh Token no válido")
    }
};

const logout  = async (req=request, res=response)=>{
    const {refreshToken} =req.body;

    try {
        
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const refreshTokenInDb = await RefreshToken.findOne({ where:{refreshToken}});

        if(!refreshTokenInDb){
            return badRequestResponse(res, "Refresh token no válido.");
        }

        await RefreshToken.destroy({where: {usuarioId:payload.id}});
    } catch (error) {
        console.log(error);
        return badRequestResponse(res, "Resfres token no válido.")
    }

    return res.json({message: "Sesión cerrada."});
};


module.exports={login,register,refreshAccessToken,logout};