"use strict";

// Importing modules
import express, { response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import {CheckJSONNewDonation, CheckLogIn} from "./functions.js";

const app = express();
const port = 3000;


app.use(express.json());
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
// Crear una donacion
//----------------------------
app.post("/api/donacion", async (request, response) => {
  let connection = null;
  try 
    {
      //Validar que el JSON recibido este correcto
      const data = request.body;
      if(!CheckJSONNewDonation(data))
      {
        response.status(500).send("JSON en formato incorrecto.");
      }
      else
      {
        console.log("DATOS enviado correctos")
      }
      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(donacionesCollection);
      const result = await collection.insertOne(data);
      
      response.status(200).send("Se creo una donacion exitosamente.");

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
// Obtener todas las donaciones
// en una lista
//----------------------------
app.get("/api/donaciones", async (request, response) => {
  let connection = null;
  try 
    {
      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(donacionesCollection);
      const result = await collection.find().toArray();

      console.log(result);

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
// LogIn
//----------------------------
app.get("/api/login", async (request, response) => {
  let connection = null;
  try 
    {
      const data = request.body;
      if(!CheckLogIn(data))
      {
        response.status(500).send("JSON en formato incorrecto.");
      }
      else
      {
        console.log("LogIn JSON en formato correcto")
      }
      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(usuariosCollection);
      const result = await collection.find({"usuario": data["usuario"]}).toArray();


      console.log("LENGTH",result.length);
      if (result.length === 1 && result[0]["contraseña"] ===  data["contraseña"])
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
          connection.end();
          console.log("Connection closed succesfully!");
        }
      } 
*/