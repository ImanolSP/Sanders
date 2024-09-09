"use strict";

// Importing modules
import express, { request, response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import {CheckJSONNewDonation, CheckLogIn, CheckUsuario} from "./functions.js";
import cors from 'cors';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import cookieParser from 'cookie-parser'; // Import cookie-parser

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  // Specify the exact origin of your frontend
  credentials: true,  
  exposedHeaders: ['Content-Range', 'X-Total-Count'], // Expose headers to the client
}));

app.use(cookieParser()); // Use this middleware so the app can read cookies

// Connection URL
const url = "mongodb://localhost:27017";
const CLIENT = new MongoClient(url);
const dbName = "TEST101";
const donacionesCollection = "donaciones";
const usuariosCollection = "usuarios";
const SECRET_KEY = "Whatever";

async function connectToDB() {
  return await CLIENT.connect();
}


//FUNCTION YET TO BE REVISED, NOT WORKING 100%
const verifyToken = (requiredAccessLevel) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }
      if (decoded.nivel_acceso < requiredAccessLevel) {
        return res.status(403).json({ message: 'Insufficient access level' });
      }
      req.user = decoded;
      next();
    });
  };
};




//----------------------------
// ENDPOINT
// Crear una donacion
//----------------------------
app.post("/donaciones", async (request, response) => {
  let connection = null;
  try 
    {
      //Validar que el JSON recibido este correcto
      const data = request.body;
      if(!CheckJSONNewDonation(data))
      {
        console.log("Formato incorecto")
        return response.status(500).send("JSON en formato incorrecto.");
      }
      
      console.log("DATOS enviado correctos")
      
      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(donacionesCollection);
      const result = await collection.insertOne(data);

      if (result.acknowledged)
      {
        return response.status(201).json({ status: true, id: result.insertedId });
      }
      else return response.status(500).json({ status: false, id: "" });

    }
    catch (error) {
        response.status(500);
        response.json({ status: false, id: "" });
        console.log(error);
      }
      finally {
        if (connection !== null) {
          await connection.close();
          console.log("Connection closed succesfully!");
        }
      }
});

//----------------------------
// ENDPOINT
// Obtener todas las donaciones
// en una lista
//----------------------------
app.get("/donaciones", async (request, response) => {
  let connection = null;
 
  try 
    {
      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(donacionesCollection);
      const result = await collection.find().toArray();

    console.log(result);

      result.forEach(item => {
         item.id = item._id;
         delete item._id;  //La pagina necesita un componenete "id" pero mongo regresa "_id"
    });
      response.setHeader('Content-Range', `donaciones 0-${result.length}/${result.length}`);
      response.setHeader('X-Total-Count', `${result.length}`);
      response.status(200).json(result);

  } catch (error) {
    response.status(500);
    response.json(error);
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
      console.log("Connection closed successfully!");
    }
  }
});

//----------------------------
// ENDPOINT
// Obtener todos las usuarios
// en una lista
//----------------------------
app.get("/usuarios", async (request, response) => {
  let connection = null;
  try 
    {
      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(usuariosCollection);
      const result = await collection.find().toArray();


      console.log(result);
      result.forEach((usuario) => {
        delete usuario.contraseña;
      })

      response.setHeader('Content-Range', `donaciones 0-${result.length}/${result.length}`);
      response.setHeader('X-Total-Count', `${result.length}`);
      response.status(200).json(result);
    }
    catch (error) {
        response.status(500);
        response.json(error);
        console.log(error);
      }
      finally {
        if (connection !== null) {
          await connection.close();
          console.log("Connection closed succesfully!");
        }
      }
});

//----------------------------
// ENDPOINT
// Crear un usuario
//----------------------------
app.post("/usuarios", async (request, response) =>{
  let connection = null;
    try 
    {
      //Validar que el JSON recibido este correcto
      const data = request.body;
      if(!CheckUsuario(data))
      {
        console.log("Formato incorrecto")
        return response.status(500).json({ status: false, id: "" });
      }
  
      console.log("DATOS enviado correctos")
      
      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(usuariosCollection);
      const check = await collection.find({"usuario": data["usuario"]}).toArray();

      if (check.length !== 0)
      {
        console.log("Ese usuario ya existe.")
        return response.status(500).json({ status: false, id: "" });
      }


      const result = await collection.insertOne(data);

      //console.log(result);
      if (result.acknowledged)
      {
        return response.status(200).json({ status: true, id: result.insertedId });
      }
      else return response.status(500).json({ status: false, id: "" });

    }
    catch (error) {
        response.status(500);
        response.json({ status: false, id: "" });
        console.log(error);
      }
      finally {
        if (connection !== null) {
          await connection.close();
          console.log("Connection closed succesfully!");
        }
      } 
});


//----------------------------
// ENDPOINT
// LogIn
//----------------------------
app.post("/login", async (request, response) => {
  let connection = null;
  try {
    const data = request.body;
    if (!CheckLogIn(data)) {
      return response.status(400).json({ message: "Invalid request format." });
    }
    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(usuariosCollection);
    const result = await collection.find({ "usuario": data["usuario"] }).toArray();

    if (result.length === 1 && result[0]["contraseña"] === data["contraseña"]) {
      const token = jwt.sign(
        { username: data.usuario, nivel_acceso: result[0].nivel_acceso }, 
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      response.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: 'Strict'
      });
      response.status(200).json({ acceso: true, nivel_acceso: result[0]["nivel_acceso"] });
    } else {
      response.status(200).json({ acceso: false, nivel_acceso: 0 });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  } finally {
    if (connection !== null) {
      await connection.close();
    }
  }
});


//----------------------------
// ENDPOINT
// LogOut
//----------------------------
app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, // falso pro ser HTTP
    sameSite: 'Strict'
  });;
  res.status(200).json({ message: 'Logged out successfully' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


/*
let connection = null;
  try 
    {
     
    }
    catch (error) {
        response.status(500);
        response.json(error);
        console.log(error);
      }
      finally {
        if (connection !== null) {
          await connection.close();
          console.log("Connection closed succesfully!");
        }
      }
*/