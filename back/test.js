"use strict"

import { CheckJSONNewDonation, isNumber1_3, isPositiveNumber, isString } from "./functions.js";
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
                            {"field": "apellido", "checkFunction": isString}, 
                            {"field": "email", "checkFunction": isString},
                            {"field": "monto", "checkFunction": isPositiveNumber},
                            {"field": "na", "checkFunction": isNumber1_3}];


const testJSON = {
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



const donacion = {
    "monto": "1",
    "fecha": "2020-08",
    "donador": "ass"
  };

console.log(CheckJSONNewDonation(donacion));