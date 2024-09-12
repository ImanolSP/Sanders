from pymongo import MongoClient 
import json
import hashlib

########################################
#PARA QUE FUNCIONE CORRE EN TERMINAL
#pip3 install pymongo
#Tambien tienes que tener corriendo el servidor de mongo
########################################
nombreDB = "TEST101"
nombreCollection1 = "donaciones"
nombreCollection2 = "usuarios"
########################################
def hashInput(input_string):
    # Encode the input string to bytes
    encoded_input = input_string.encode('utf-8') 
    # Create a SHA-256 hash object
    sha256_hash = hashlib.sha256()
    # Update the hash object with the encoded input
    sha256_hash.update(encoded_input)
    # Get the hexadecimal representation of the hash
    hash_hex = sha256_hash.hexdigest()
    return hash_hex
########################################

client = MongoClient('mongodb://localhost:27017/')
db = client[nombreDB]

db.drop_collection(nombreCollection1)
collection1 = db[nombreCollection1]
db.drop_collection(nombreCollection2)
collection2 = db[nombreCollection2]


with open('./donaciones.json') as f:
    data = json.load(f)
    collection1.insert_many(data)

with open('./usuarios.json') as f:
    data = json.load(f)
    for i in data:
        if "contraseña" in i:
            i["contraseña"] = hashInput(i["contraseña"])
        else:
            print(f"Advertencia: La clave 'contraseña' no se encuentra en el registro: {i}")
    collection2.insert_many(data)


print("Data inserted successfully.")
