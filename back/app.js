"use strict";

// Importing modules
import express, { request, response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import { CheckDonacion, CheckLogIn, CheckUsuario, CheckDonacionEdit, CheckUsuarioEdit } from "./functions.js";
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import https from 'https';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
  origin: 'https://localhost:5173',  // Specify the exact origin of your frontend
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

// FUNCTION YET TO BE REVISED, NOT WORKING 100%
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
  try {
    // Validar que el JSON recibido este correcto
    const data = request.body;
    if (!CheckDonacion(data)) {
      console.log("POST /donaciones: FALSE\nFormato Incorrecto en JSON");
      return response.status(200).json({ status: false, id: "" });
    }

    // Crear conexion a base de datos
    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(donacionesCollection);
    const result = await collection.insertOne(data);

    if (result.acknowledged) {
      console.log("POST /donaciones: TRUE");
      return response.status(200).json({ status: true, id: result.insertedId });
    } else {
      console.log("POST /donaciones: FALSE\nAcknowledged: FALSE");
      return response.status(500).json({ status: false, id: "" });
    }
  } catch (error) {
    console.log("POST /donaciones: FALSE\nCATCH");
    response.status(500);
    response.json({ status: false, id: "" });
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
      console.log("CCS!");
    }
    console.log("\n");
  }
});

// ----------------------------
// ENDPOINT
// Obtener todas las donaciones
// en una lista
// ----------------------------
app.get("/donaciones", async (request, response) => {
  let connection = null;
  try {
    // Crear conexion a base de datos
    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(donacionesCollection);
    const result = await collection.find().toArray();

    result.forEach(item => {
      item.id = item._id;
      delete item._id;  // La pagina necesita un componenete "id" pero mongo regresa "_id"
    });
    response.setHeader('Content-Range', `donaciones 0-${result.length}/${result.length}`);
    response.setHeader('X-Total-Count', `${result.length}`);
    response.status(200).json(result);
    console.log("GET /donaciones: TRUE");

  } catch (error) {
    console.log("GET /donaciones: FALSE\nCATCH");
    response.status(500);
    response.json(error);
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
      console.log("CCS!");
    }
    console.log("\n");
  }
});

// ----------------------------
// ENDPOINT
// Borrar una donacion
// ----------------------------
app.delete("/donaciones", async (request, response) => {
  let connection = null;
  try {
    const data = request.body;

    // Crear conexion a base de datos
    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(donacionesCollection);
    const result = await collection.deleteOne({ _id: new ObjectId(data.id) });

    if (result.acknowledged && result.deletedCount === 1) {
      console.log("DELETE /donaciones: TRUE");
      response.status(200).json({ status: true });
    } else {
      console.log("DELETE /donaciones: FALSE\nAcknowledged: FALSE || DeletedCount !== 1");
      response.status(200).json({ status: false });
    }
  } catch (error) {
    console.log("DELETE /donaciones: FALSE\nCATCH");
    response.status(500);
    response.json({ status: false });
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
      console.log("CCS!");
    }
    console.log("\n");
  }
});

// ----------------------------
// ENDPOINT
// Editar una donacion
// ----------------------------
app.put("/donaciones", async (request, response) => {
  let connection = null;
  try {
    const data = request.body;
    const formatData = CheckDonacionEdit(data);
    if (!formatData.status) {
      console.log("PUT /donaciones: FALSE\nFormato Incorrecto en JSON");
      return response.status(200).json({ status: false });
    }

    // Crear conexion a base de datos
    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(donacionesCollection);
    const result = await collection.updateOne({ _id: new ObjectId(data.id) },
      { $set: formatData.updateFields });

    if (result.acknowledged && result.matchedCount === 1) {
      console.log("PUT /donaciones: TRUE");
      response.status(200).json({ status: true });
    } else {
      console.log("PUT /donaciones: FALSE\nAcknowledged: FALSE || matchedCount !== 1");
      response.status(200).json({ status: false });
    }

  } catch (error) {
    console.log("PUT /donaciones: FALSE\nCATCH");
    response.status(500);
    response.json({ status: false });
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
      console.log("CCS!");
    }
    console.log("\n");
  }
});

// ----------------------------
// ENDPOINT
// Obtener todos los usuarios
// en una lista
// ----------------------------
app.get("/usuarios", async (request, response) => {
  let connection = null;
  try {
    // Crear conexion a base de datos
    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(usuariosCollection);
    const result = await collection.find().toArray();

    result.forEach((usuario) => {
      delete usuario.contraseña;
    });

    response.setHeader('Content-Range', `usuarios 0-${result.length}/${result.length}`);
    response.setHeader('X-Total-Count', `${result.length}`);
    response.status(200).json(result);
    console.log("GET /usuarios: TRUE");

  } catch (error) {
    console.log("GET /usuarios: FALSE\nCATCH");
    response.status(500);
    response.json(error);
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
      console.log("CCS!");
    }
    console.log("\n");
  }
});

// ----------------------------
// ENDPOINT
// Crear un usuario
// ----------------------------
app.post("/usuarios", async (request, response) => {
  let connection = null;
  try {
    // Validar que el JSON recibido este correcto
    const data = request.body;
    if (!CheckUsuario(data)) {
      console.log("POST /usuarios: FALSE\nFormato Incorrecto en JSON");
      return response.status(200).json({ status: false, id: "" });
    }

    // Crear conexion a base de datos
    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(usuariosCollection);
    const result = await collection.insertOne(data);

    if (result.acknowledged) {
      console.log("POST /usuarios: TRUE");
      response.status(200).json({ status: true, id: result.insertedId });
    } else {
      console.log("POST /usuarios: FALSE\nAcknowledged: FALSE");
      response.status(500).json({ status: false, id: "" });
    }
  } catch (error) {
    console.log("POST /usuarios: FALSE\nCATCH");
    response.status(500);
    response.json({ status: false, id: "" });
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
      console.log("CCS!");
    }
    console.log("\n");
  }
});

// ----------------------------
// ENDPOINT
// Borrar un usuario
// ----------------------------
app.delete("/usuarios", async (request, response) => {
  let connection = null;
  try {
    const data = request.body;

    // Crear conexion a base de datos
    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(usuariosCollection);
    const result = await collection.deleteOne({ _id: new ObjectId(data.id) });

    if (result.acknowledged && result.deletedCount === 1) {
      console.log("DELETE /usuarios: TRUE");
      response.status(200).json({ status: true });
    } else {
      console.log("DELETE /usuarios: FALSE\nAcknowledged: FALSE || DeletedCount !== 1");
      response.status(200).json({ status: false });
    }
  } catch (error) {
    console.log("DELETE /usuarios: FALSE\nCATCH");
    response.status(500);
    response.json({ status: false });
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
      console.log("CCS!");
    }
    console.log("\n");
  }
});

// ----------------------------
// ENDPOINT
// Editar un usuario
// ----------------------------
app.put("/usuarios", async (request, response) => {
  let connection = null;
  try {
    const data = request.body;
    const formatData = CheckUsuarioEdit(data);
    if (!formatData.status) {
      console.log("PUT /usuarios: FALSE\nFormato Incorrecto en JSON");
      return response.status(200).json({ status: false });
    }

    // Crear conexion a base de datos
    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(usuariosCollection);
    const result = await collection.updateOne({ _id: new ObjectId(data.id) },
      { $set: formatData.updateFields });

    if (result.acknowledged && result.matchedCount === 1) {
      console.log("PUT /usuarios: TRUE");
      response.status(200).json({ status: true });
    } else {
      console.log("PUT /usuarios: FALSE\nAcknowledged: FALSE || matchedCount !== 1");
      response.status(200).json({ status: false });
    }

  } catch (error) {
    console.log("PUT /usuarios: FALSE\nCATCH");
    response.status(500);
    response.json({ status: false });
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
      console.log("CCS!");
    }
    console.log("\n");
  }
});

// Load SSL certificates
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// Create HTTPS server
https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS Server running at https://localhost:${port}`);
});
