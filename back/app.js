"use strict";

// Importing modules
import express, { request, response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import {CheckDonacion, CheckLogIn, CheckUsuario, CheckDonacionEdit, CheckUsuarioEdit, CheckBadEntries, AddBadEntry, ClearBadEntries} from "./functions.js";
import cors from 'cors';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import cookieParser from 'cookie-parser'; 
import https from 'https';
import fs  from 'fs';
import enviarCorreo from "./correo.js";


const app = express();
const port = 3000;

// Leer certificados SSL
const privateKey = fs.readFileSync('BackEnd-HTTPS//server.key', 'utf8');
const certificate = fs.readFileSync('BackEnd-HTTPS//server.crt', 'utf8');
const ca = fs.readFileSync('BackEnd-HTTPS//ca.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate, ca: ca };

// Si no funciona el back, entren a loclahost:3000 y confien en la pagina 
// Ruta para probar el backend en el navegador
app.get('/', (req, res) => {
  res.send('Su compu acepto la certificacion del backend'); // Mensaje que se verá en la ventana del navegador
});

app.use(express.json());
app.use(cors({
  origin:  ['https://localhost:5173', 'http://localhost:3001'],  // Specify the exact origin of your frontend
  credentials: true,  
  exposedHeaders: ['Content-Range', 'X-Total-Count'], // Expose headers to the client
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(cookieParser()); // Use this middleware so the app can read cookies

// Connection URL
const url = "mongodb://localhost:27017";
const CLIENT = new MongoClient(url);
const dbName = "TEST101";
const donacionesCollection = "donaciones";
const usuariosCollection = "usuarios";
const entriesCollection = "bad_entries";
const intentosPermitidos = 3;
const minutosBloqueado = 15;
//
const projectsCollection = "projects";
//
const SECRET_KEY = "Whatever";

async function connectToDB() {
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
      //console.log(data);
      
      if(!CheckDonacion(data))
      {     
        console.log("POST /donaciones: FALSE\nFormato Incorrecto en JSON");
        return response.status(200).json({ status: false, id: "" });
      }
      
      //console.log("DATOS enviado correctos")
      
      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(donacionesCollection);
      const result = await collection.insertOne(data);

      // Obtener el correo electrónico del donador 
      const emailDonador = data.donador.email; 
      const nombreDonador = data.donador.nombre; 
      
      // Enviar correo de agradecimiento 
      enviarCorreo(emailDonador, nombreDonador)

      if (result.acknowledged)
      {
        console.log("POST /donaciones: TRUE");
        return response.status(200).json({ status: true, id: result.insertedId });
      }
      else {
        console.log("POST /donaciones: FALSE\nAcknowledged: FALSE");
        return response.status(500).json({ status: false, id: "" });
      }
    }
    catch (error) {
        console.log("POST /donaciones: FALSE\nCATCH");
        response.status(500);
        response.json({ status: false, id: "" });
        console.log(error);
      }
      finally {
        if (connection !== null) {
          await connection.close();
          console.log("CCS!");
        }
        console.log("\n");
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

    //console.log(result);

      result.forEach(item => {
         item.id = item._id;
         delete item._id;  //La pagina necesita un componenete "id" pero mongo regresa "_id"
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

//----------------------------
// ENDPOINT
// Borrar una donacion
//----------------------------
app.delete("/donaciones", async (request, response) => {
  let connection = null;
  try 
    {
      const data = request.body;

      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(donacionesCollection);
      const result = await collection.deleteOne({ _id: new ObjectId(data.id) });
      
      //console.log(result);
      if (result.acknowledged && result.deletedCount === 1) 
      {
        console.log("DELETE /donaciones: TRUE");
        response.status(200).json({ status: true});
      }
      else
      {
        console.log("DELETE /donaciones: FALSE\nAcknowledged: FALSE || DeletedCount !== 1");
        response.status(200).json({ status: false});
      }
    }
    catch (error) {
        console.log("DELETE /donaciones: FALSE\nCATCH");
        response.status(500);
        response.json({ status: false});
        console.log(error);
      }
      finally {
        if (connection !== null) {
          await connection.close();
          console.log("CCS!");
        }
        console.log("\n");
      }
});

//----------------------------
// ENDPOINT
// Editar una donacion
//----------------------------
app.put("/donaciones", async (request, response) => {
  let connection = null;
  try 
    {
      const data = request.body;
      console.log("THE EDIT DATA IS:",data);
      const formatData = CheckDonacionEdit(data);
      if (!formatData.status)
      {
        console.log("PUT /donaciones: FALSE\nFormato Incorrecto en JSON");
        return response.status(200).json({ status: false });
      }

      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(donacionesCollection);
      const result = await collection.updateOne({ _id: new ObjectId(data.id) }, 
                            { $set: formatData.updateFields});
      
      //console.log(result);
      
      if (result.acknowledged && result.matchedCount === 1) 
      {
        console.log("PUT /donaciones: TRUE");
        response.status(200).json({ status: true});
      }
      else
      {
        console.log("PUT /donaciones: FALSE\nAcknowledged: FALSE || matchedCount !== 1");
        response.status(200).json({ status: false});
      }
      
    }
    catch (error) {
        console.log("PUT /donaciones: FALSE\nCATCH");
        response.status(500);
        response.json({ status: false});
        console.log(error);
      }
      finally {
        if (connection !== null) {
          await connection.close();
          console.log("CCS!");
        }
        console.log("\n");
      }
});



//----------------------------
// ENDPOINT
// Obtener todos las usuarios
// en una lista
//----------------------------
app.get("/usuarios", /*verifyToken(1)*/ async (request, response) => {
  let connection = null;
  try 
    {
      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(usuariosCollection);
      const result = await collection.find().toArray();


      //console.log(result);
      result.forEach((usuario) => {
        delete usuario.contraseña;
      })
      result.forEach(item => {
        item.id = item._id;
        delete item._id;  //La pagina necesita un componenete "id" pero mongo regresa "_id"
   });


      response.setHeader('Content-Range', `donaciones 0-${result.length}/${result.length}`);
      response.setHeader('X-Total-Count', `${result.length}`);
      response.status(200).json(result);
      console.log("GET /usuarios: TRUE");


    }
    catch (error) {
        console.log("GET /usuarios: FALSE\nCATCH");
        response.status(500);
        response.json(error);
        console.log(error);
      }
      finally {
        if (connection !== null) {
          await connection.close();
          console.log("CCS!");
        }
        console.log("\n");
      }
});

//----------------------------
// ENDPOINT
// Obtener la donación a editar
//----------------------------
app.get("/donaciones/:id", async (request, response) => {
  let connection = null;
  try {
      const donacionId = request.params.id;
      console.log("The donation ID IS:",donacionId)
      // Connect to DB
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(donacionesCollection);

      // Find dnacion by ID
      const donID = await collection.findOne({ _id: new ObjectId(donacionId) });
      console.log("donacion ID",donID)
      if (donID) {
        console.log("ENTERED THE USER TRUE")
          response.status(200).json(donID);
      } else {
          response.status(404).json({ message: "Donation does not exist" });
      }
  } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Internal server error" });
  } finally {
      if (connection !== null) {
          await connection.close();
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
        console.log("POST /usuarios: FALSE\nFormato Incorrecto en JSON");
        return response.status(500).json({ status: false, id: "" });
      }
  
      //console.log("DATOS enviado correctos")
      
      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(usuariosCollection);
      const check = await collection.find({"usuario": data["usuario"]}).toArray();

      if (check.length !== 0)
      {
        console.log("POST /usuarios: FALSE\nUsuario repetido");
        return response.status(500).json({ status: false, id: "" });
      }


      const result = await collection.insertOne(data);

      //console.log(result);
      if (result.acknowledged)
      {
        console.log("POST /usuarios: TRUE");
        return response.status(200).json({ status: true, id: result.insertedId });
      }
      else {
        console.log("POST /usuarios: FALSE\nAcknowledged: FALSE");
        return response.status(500).json({ status: false, id: "" });
      }
    }
    catch (error) {
      console.log("POST /usuarios: FALSE\nCATCH");
        response.status(500);
        response.json({ status: false, id: "" });
        console.log(error);
      }
      finally {
        if (connection !== null) {
          await connection.close();
          console.log("CCS!");
        }
        console.log("\n");
      } 
});

//----------------------------
// ENDPOINT
// Borrar una usuario
//----------------------------
app.delete("/usuarios", async (request, response) => {
  let connection = null;
  try 
    {
      const data = request.body;

      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(usuariosCollection);
      const result = await collection.deleteOne({ _id: new ObjectId(data.id) });
      
      console.log("RESULTADOS",result);
      console.log("RESULTADOS2",data);
      if (result.acknowledged && result.deletedCount === 1) 
      {
        console.log("DELETE /usuarios: TRUE");
        response.status(200).json({ status: true});
      }
      else
      {
        console.log("DELETE /usuarios: FALSE\nAcknowledged: FALSE || DeletedCount !== 1");
        response.status(200).json({ status: false});
      }
    }
    catch (error) {
        console.log("DELETE /usuarios: FALSE\nCATCH");
        response.status(500);
        response.json({ status: false});
        console.log(error);
      }
      finally {
        if (connection !== null) {
          await connection.close();
          console.log("CCS!");
        }
        console.log("\n");
      }
});

//----------------------------
// ENDPOINT
// Editar un usuario
//----------------------------
app.put("/usuarios", async (request, response) => {
  let connection = null;
  try 
    {
      const data = request.body;
      const formatData = CheckUsuarioEdit(data);
      if (!formatData.status)
      {
        console.log("PUT /usuarios: FALSE\nFormato Incorrecto en JSON");
        return response.status(200).json({ status: false });
      }

      //Crear conexion a base de datos
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(usuariosCollection);
      const result = await collection.updateOne({ _id: new ObjectId(data.id) }, 
                            { $set: formatData.updateFields});
      
      //console.log(result);
      
      if (result.acknowledged && result.matchedCount === 1) 
      {
        console.log("PUT /usuarios: TRUE");
        response.status(200).json({ status: true});
      }
      else
      {
        console.log("PUT /usuarios: FALSE\nAcknowledged: FALSE || matchedCount !== 1");
        response.status(200).json({ status: false});
      }
      
    }
    catch (error) {
        console.log("PUT /usuarios: FALSE\nCATCH");
        response.status(500);
        response.json({ status: false});
        console.log(error);
      }
      finally {
        if (connection !== null) {
          await connection.close();
          console.log("CCS!");
        }
        console.log("\n");
      }
});
//----------------------------
// ENDPOINT
// Usado para conseguir un usuario, este para poder ser editado
//----------------------------
app.get("/usuarios/:id", async (request, response) => {
  let connection = null;
  try {
      const userId = request.params.id;
      console.log("The user ID IS:",userId)
      // Connect to DB
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(usuariosCollection);

      // Find user by ID
      const user = await collection.findOne({ _id: new ObjectId(userId) });
      console.log("USER ID",user)
      if (user) {
        console.log("ENTERED THE USER TRUE")
          response.status(200).json(user);
      } else {
          response.status(404).json({ message: "User does not exist" });
      }
  } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Internal server error" });
  } finally {
      if (connection !== null) {
          await connection.close();
      }
  }
});



//----------------------------
// ENDPOINT
// GET /projects
//----------------------------
app.get("/projects", async (request, response) => {
  let connection = null;
  try {
    const { filter, range, sort } = request.query;

    // Parsear los parámetros
    const parsedFilter = filter ? JSON.parse(filter) : {};
    const parsedRange = range ? JSON.parse(range) : [0, 9];
    const parsedSort = sort ? JSON.parse(sort) : ["id", "ASC"];

    const [skip, limit] = parsedRange;
    const [sortField, sortOrder] = parsedSort;

    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(projectsCollection);

    const total = await collection.countDocuments(parsedFilter);
    const cursor = collection.find(parsedFilter)
      .sort({ [sortField]: sortOrder === "ASC" ? 1 : -1 })
      .skip(skip)
      .limit(limit - skip + 1);

    const result = await cursor.toArray();

    result.forEach(item => {
      item.id = item._id;
      delete item._id;
    });

    response.setHeader('Content-Range', `projects ${skip}-${limit}/${total}`);
    response.setHeader('X-Total-Count', `${total}`);
    response.status(200).json(result);
    console.log("GET /projects: TRUE");
  } catch (error) {
    console.log("GET /projects: FALSE\nCATCH");
    response.status(500).json(error);
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
    }
  }
});

//----------------------------
// ENDPOINT
// POST /projects
//----------------------------
app.post("/projects", async (request, response) => {
  let connection = null;
  try {
    const data = request.body;

    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(projectsCollection);
    const result = await collection.insertOne(data);
    //
    if (!data.donacionesRecibidas) {
      data.donacionesRecibidas = 0;
    }

    if (result.acknowledged) {
      const createdProject = await collection.findOne({ _id: result.insertedId });
      createdProject.id = createdProject._id;
      delete createdProject._id;

      response.status(200).json(createdProject);
      console.log("POST /projects: TRUE");
    } else {
      response.status(500).json({ status: false });
      console.log("POST /projects: FALSE");
    }
  } catch (error) {
    response.status(500).json({ status: false });
    console.log("POST /projects: FALSE\nCATCH");
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
    }
  }
});

//----------------------------
// ENDPOINT
// PUT /projects
//----------------------------
app.put("/projects", async (request, response) => {
  let connection = null;
  try {
    const data = request.body;
    const projectId = data.id;
    delete data.id; // Remove id from data to avoid updating it

    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(projectsCollection);
    const result = await collection.updateOne(
      { _id: new ObjectId(projectId) },
      { $set: data }
    );

    if (result.acknowledged && result.matchedCount === 1) {
      const updatedProject = await collection.findOne({ _id: new ObjectId(projectId) });
      updatedProject.id = updatedProject._id;
      delete updatedProject._id;

      response.status(200).json(updatedProject);
      console.log("PUT /projects: TRUE");
    } else {
      response.status(500).json({ status: false });
      console.log("PUT /projects: FALSE");
    }
  } catch (error) {
    response.status(500).json({ status: false });
    console.log("PUT /projects: FALSE\nCATCH");
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
    }
  }
});
//----------------------------
// ENDPOINT
// DELETE /projects
//----------------------------
app.delete("/projects", async (request, response) => {
  let connection = null;
  try {
    const data = request.body;
    const projectId = data.id;

    connection = await connectToDB();
    const db = connection.db(dbName);
    const collection = db.collection(projectsCollection);
    const deletedProject = await collection.findOne({ _id: new ObjectId(projectId) });

    const result = await collection.deleteOne({ _id: new ObjectId(projectId) });

    if (result.acknowledged && result.deletedCount === 1) {
      deletedProject.id = deletedProject._id;
      delete deletedProject._id;
      response.status(200).json(deletedProject);
      console.log("DELETE /projects: TRUE");
    } else {
      response.status(500).json({ status: false });
      console.log("DELETE /projects: FALSE");
    }
  } catch (error) {
    response.status(500).json({ status: false });
    console.log("DELETE /projects: FALSE\nCATCH");
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
    }
  }
});



//----------------------------
// ENDPOINT
// LogIn
//----------------------------
//----------------------------
app.post("/login", async (request, response) => {
  let connection = null;
  try {
    const data = request.body;

    if (!CheckLogIn(data)) {
      console.log("POST /login: FALSE\nFormato Incorrecto.");
      return response.status(400).json({ acceso: false, nivel_acceso: 0 });
    }

    connection = await connectToDB();
    const db = connection.db(dbName);
    const u_collection = db.collection(usuariosCollection);
    const e_collection = db.collection(entriesCollection);
    const result = await u_collection.find({ "usuario": data["usuario"] }).toArray();

    if ( result.length !== 1)
    {
      console.log("POST /login: FALSE\nNo existe ese usuario o hay error en BDD.");
      return response.status(200).json({ acceso: false, nivel_acceso: 0 });
    }
  
    await ClearBadEntries(e_collection, minutosBloqueado);

    if (await CheckBadEntries(e_collection, data.usuario, intentosPermitidos))
    {
      console.log("POST /login: FALSE\nBloqueado por intentos fallidos.");
      return response.status(200).json({ acceso: false, nivel_acceso: 0 });
    }
    else if( result[0]["contraseña"] !== data["contraseña"] )
    {
      console.log("POST /login: FALSE\nContraseña incorrecta.");
      await AddBadEntry(e_collection, data.usuario);
      return response.status(200).json({ acceso: false, nivel_acceso: 0 });
    }
    else { // TODO BIEN
      
      // Create JWT token containing nivel_acceso and username
      const tokenData = {
        username: data.usuario,
        nivel_acceso: result[0].nivel_acceso
      };

      // Generate JWT token with SECRET_KEY and set it to expire in 1 hour
      const token = jwt.sign(tokenData, SECRET_KEY, { expiresIn: '1h' });
      console.log("POST /login: TRUE\nAccess Granted!");
      // Send response with access and token
      response.status(200).json({
        acceso: true, 
        nivel_acceso: result[0]["nivel_acceso"],
        token: token // send the token in the response
      });
    } 
  } catch (error) {
    console.log("POST /login: FALSE\nCATCH");
    response.status(500);
    response.json({ acceso: false});
    console.log(error);
  } finally {
    if (connection !== null) {
      await connection.close();
      console.log("CCS!");
    }
    console.log("\n");
  }
});


//----------------------------
// ENDPOINT
// LogOut
//----------------------------
app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    //httpOnly: true,
    secure: true, // falso pro ser HTTP
    sameSite: 'Strict'
  });;
  res.status(200).json({ message: 'Logged out successfully' });
});


app.get("/test", async (request, response) => {
  let connection = null;
  const intentosPermitidos = 3;
  const curDate =  new Date();
  try {
      let data = request.body;
      


      console.log("DATA: ",data);
      // Connect to DB
      connection = await connectToDB();
      const db = connection.db(dbName);
      const collection = db.collection(entriesCollection);
      
      let result = null;

      await ClearBadEntries(collection, minutosBloqueado);
      return response.status(200).send("TEST");
      
      //Borrar intentos despues de 15 minutos
      //ClearIPs(collection, );

      console.log("CHECK: ", check);
      if (check.length === 0)
      {
        data.intentos = 1;
        data.ip = request.ip;
        data.fecha = curDate;
        result = await collection.insertOne(data);
      }
      else
      {
        const intentos = check[0].intentos;
        console.log("INTENTOS:", intentos )
        if (intentos >= intentosPermitidos){return response.status(200).send("SUFICIENTES INTENTOS");}

        result = await collection.updateOne({"ip": request.ip}, 
        { $set: {"intentos": intentos + 1}});
      }

      response.status(200).send("TEST");
     
      
  } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Internal server error" });
  } finally {
      if (connection !== null) {
          await connection.close();
      }
  }
});



/*app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
*/

//Servidor HTTPS
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => console.log(`Server running on port ${port} with HTTPS`));

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
          console.log("CCS!");
        }
        console.log("\n");
      }
*/