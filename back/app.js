"use strict";

// Importing modules
import express, { request, response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import {CheckJSONNewDonation, CheckLogIn, CheckUsuario} from "./functions.js";
import cors from 'cors';

const app = express();
const port = 3000;


app.use(express.json());
app.use(cors({
  exposedHeaders: ['Content-Range', 'X-Total-Count'], // Expose headers to the client
}));
//app.use(express.urlencoded({ extended: true }));
//app.use(express.static('../public'))

// Connection URL
const url = "mongodb://localhost:27017"; // Change this URL if your MongoDB is hosted differently
const CLIENT = new MongoClient(url);
const dbName = "TEST101";
const donacionesCollection = "donaciones";
const usuariosCollection = "usuarios";




async function connectToDB() {
  // Use connect method to connect to the server
    return await CLIENT.connect();
}


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
  //console.log("Entro al api")
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
// LogIn
//----------------------------
app.get("/api/login", async (request, response) => {
  let connection = null;
  try 
    {
      const data = request.body;
      if(!CheckLogIn(data))
      {
        return response.status(500).send("JSON en formato incorrecto.");
      }
      
      console.log("LogIn JSON en formato correcto")
      
      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(usuariosCollection);
      const result = await collection.find({"usuario": data["usuario"]}).toArray();


      console.log("LENGTH",result.length);
      if (result.length > 0 && result[0]["contraseña"] ===  data["contraseña"])
      {
        console.log("LogIn Correcto")
        response.status(200).json({"acceso": true, "nivel_acceso": result[0]["nivel_acceso"]});
      }
      else
      {
        console.log("LogIn Incorrecto.")
        response.status(200).json({"acceso": false, "nivel_acceso": 0});
      }
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