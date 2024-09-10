"use strict"

import {isJSON, CheckDonacionEdit, CheckJsonEdit, isNumber1_3, isPositiveNumber, isString, CheckUsuarioEdit } from "./functions.js";
/*
console.log(isNumberRange(0,3,0));
console.log(isNumberRange(0,3,1));
console.log(isNumberRange(0,3,2));
console.log(isNumberRange(0,3,3));
console.log(isNumberRange(0,3,4));

console.log(isString("abc"));
console.log(isString(""));
console.log(isString(1));
console.log(isString(null));
console.log(isString("abcdef"));*/

const reqDonadorFieldst = [{"field": "nombre", "checkFunction": isString},
                            {"field": "fecha", "checkFunction": isString}, 
                            {"field": "email", "checkFunction": isString},
                            {"field": "monto", "checkFunction": isPositiveNumber},
                            {"field": "na", "checkFunction": isNumber1_3}];


const testJSON = {
    id: "123",
    "nombre": "Micheal",
    "apellido": "www",
    "email": "ddd",
    "monto": 233,
    "na": 1
  };

function checkJson(fields, json)
{

    for (let i = 0; i < fields.length;i++)
    {
        const fieldName = fields[i].field
        const fieldValue = json[fieldName];
        if (fieldValue === undefined 
            || !fields[i].checkFunction(fieldValue) )
        {
            return false
        }
    }
    return true;
}

//console.log(checkJson(reqDonadorFieldst, testJSON));

//console.log(typeof {"Hello": {}});

const reqDonacionFields = [{"field": "monto", "checkFunction": isPositiveNumber}, 
                            {"field": "fecha", "checkFunction": isString},
                            {"field": "donador", "checkFunction": isJSON}]

const donacion = {
    id: "123",
    "monto": 200,
    xx:2,
    "fecha": "2022-08",
    "donador": {
      
    }
  };


const usuario = {
    id : "123",
    "usuario": "maria.sanchez",
    "nivel_acceso": "2",
    "zz":2
  }
//console.log(CheckJSONNewDonation(donacion));


console.log(CheckDonacionEdit( donacion));
console.log(CheckUsuarioEdit(usuario));