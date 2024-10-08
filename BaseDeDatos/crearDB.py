from pymongo import MongoClient 
import json
import hashlib

########################################
#PARA QUE FUNCIONE, CORRE EN TERMINAL
#pip3 install pymongo
#Tambien tienes que tener corriendo el servidor de mongo
########################################
nombreDB = "TEST101"
nombreCollection1 = "donaciones"
nombreCollection2 = "usuarios"
nombreCollection3 = "projects"
########################################
def hashInput(input_string):
    encoded_input = input_string.encode('utf-8') 
    sha256_hash = hashlib.sha256()
    sha256_hash.update(encoded_input)
    hash_hex = sha256_hash.hexdigest()
    return hash_hex
########################################

client = MongoClient('mongodb://localhost:27017/')
db = client[nombreDB]

db.drop_collection(nombreCollection1)
collection1 = db[nombreCollection1]
db.drop_collection(nombreCollection2)
collection2 = db[nombreCollection2]

db.drop_collection(nombreCollection3)
collection3 = db[nombreCollection3]


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


with open('./projects.json') as f:
    data = json.load(f)
    collection3.insert_many(data)

print("Projects data inserted successfully.")


print("Data inserted successfully.")
