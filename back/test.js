"use strict"

import { isNumberRange, isString } from "./functions.js";
/*
console.log(isNumberRange(0,3,0));
console.log(isNumberRange(0,3,1));
console.log(isNumberRange(0,3,2));
console.log(isNumberRange(0,3,3));
console.log(isNumberRange(0,3,4));
*/
console.log(isString("abc"));
console.log(isString(""));
console.log(isString(1));
console.log(isString(null));
console.log(isString("abcdef"));