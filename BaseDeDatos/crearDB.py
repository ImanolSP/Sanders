from pymongo import MongoClient 
import json

########################################
#PARA QUE FUNCIONE CORRE EN TERMINAL
#pip3 install pymongo
#Tambien tienes que tener corriendo el servidor de mongo
########################################
nombreDB = "TEST101"
nombreCollection = "donaciones"
########################################


client = MongoClient('mongodb://localhost:27017/')
db = client[nombreDB]
db.drop_collection(nombreCollection)
collection = db[nombreCollection]


with open('donaciones.json') as f:
    data = json.load(f)
    collection.insert_many(data)

print("Data inserted successfully.")