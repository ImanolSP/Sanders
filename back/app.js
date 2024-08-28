"use strict";

// Importing modules
import express, { response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import {CheckJSONNewDonation} from "./functions.js";

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




async function connectToDB() {
  // Use connect method to connect to the server
    return await CLIENT.connect();
}




app.get("/api/", async (request, response) => {
    let client = null;
    client = await connectToDB();
    const db = client.db(dbName);
    const collection = db.collection(donacionesCollection);

    console.log("Connected to MONGO!")

    const result = await collection.insertOne({"name": "Tomas", "lastName": "Molina"})

    response.status(200).json();
    await client.close();
});



app.post("/api/", async (request, response) => {
    const name = request.body.name;
    const lastname = request.body.lastname;
    
    let client = null;
    client = await connectToDB();
    const db = client.db(dbName);
    const collection = db.collection(donacionesCollection);

    const result = await collection.insertOne(request.body)

    await client.close();

    console.log(`Nuevo usuario: ${name}\nApellido: ${lastname}`);
    
    response.status(200).send("Usuario creado!");
});

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