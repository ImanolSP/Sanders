"use strict";

// Importing modules
import express, { response } from "express";
import { MongoClient, ObjectId } from "mongodb";


const app = express();
const port = 3000;


app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use(express.static('../public'))

// Connection URL
const url = "mongodb://localhost:27017"; // Change this URL if your MongoDB is hosted differently
const client = new MongoClient(url);
const dbName = "TEST101";

async function connectToDB() {
  // Use connect method to connect to the server
    return await client.connect();
}




app.get("/api/", async (request, response) => {
    let client = null;
    client = await connectToDB();
    const db = client.db(dbName);
    const collection = db.collection("donors");

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
    const collection = db.collection("donors");

    const result = await collection.insertOne({"name": name, "lastName": lastname})

    await client.close();

    console.log(`Nuevo usuario: ${name}\nApellido: ${lastname}`);
    
    response.status(200).send("Usuario creado!");
});

app.get("/api/usuario", async (request, response) => {
    const usuario = request.body.usuario;
    const contraseña = request.body.contraseña;
    
    console.log(`Log in\nUsuario: ${usuario}\nContraseña: ${contraseña}`);
    

    if(usuario === "Tomas" && contraseña === "Molina")
    {
        response.status(200).send("Log in exitoso!");
    }
    else
    {
        response.status(200).send("Log in no exitoso!");
    }
    
});

/*
//Endpoint para verificar si los datos del log in estan correctos.
app.get("/api/usuarios/:username/:password", async (request, response) => {
    let connection = null;
  
    try {
    console.log("Username: "+ request.params.username + "\nPassword: "+request.params.password);
    connection = await connectToDB();
  
      // The execute method is used to execute a SQL query. It returns a Promise that resolves with an array containing the results of the query (results) and an array containing the metadata of the results (fields).
      
    const [results, fields] = await connection.execute(
        "SELECT NombreUsuario, Contraseña FROM Usuarios WHERE NombreUsuario LIKE ?;",
        [request.params.username]
    );
 
    if (results[0] == undefined)
    {
        console.log("Username doesnt exist.\n");
        response.status(200).json({"Success": false, "Error": "Username doesnt exist."});
    }
    
    else if (results[0]["NombreUsuario"] === request.params.username && results[0]["Contraseña"] === request.params.password )
    {
    console.log("Access granted.\n");
    response.status(200).json({"Success": true});
  }
    else if (results[0]["NombreUsuario"] === request.params.username)
    {
    console.log("Wrong password.\n");
    response.status(200).json({"Success": false, "Error": "Wrong password."});
    }
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
  });*/




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});