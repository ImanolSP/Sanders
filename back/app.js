import express, { response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import { CheckJSONNewDonation, CheckLogIn } from "./functions.js";
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

app.post("/donaciones", /*verifyToken(2),*/ async (request, response) => {
  let connection = null;
  try {
    const data = request.body;
    if (!CheckJSONNewDonation(data)) {
      console.log("Formato incorecto");
      response.status(500).send("JSON en formato incorrecto.");
    } else {
      console.log("DATOS enviado correctos");
    }
    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(donacionesCollection);
    const result = await collection.insertOne(data);

      response.status(201).json({ status: true, id: result.insertedId });

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

app.get("/donaciones", /*verifyToken(2),*/ async (request, response) => {
  let connection = null;
  console.log("Entro al api");
  try {
    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(donacionesCollection);
    const result = await collection.find().toArray();

    console.log(result);

    const transformedResult = result.map(item => {
      return { ...item, id: item._id };
    });
    response.setHeader('Content-Range', `donaciones 0-${result.length}/${result.length}`);
    response.setHeader('X-Total-Count', `${result.length}`);
    response.status(200).json(transformedResult);

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
