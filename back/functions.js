
const reqDonacionFields = [{"field": "monto", "checkFunction": isPositiveNumber}, 
                            {"field": "fecha", "checkFunction": isString},
                            {"field": "metodo", "checkFunction": isMetodo},
                            {"field": "editado", "checkFunction": isBool},
                            {"field": "donador", "checkFunction": isJSON}]


const reqProyectFields = [
                            {"field": "nombre", "checkFunction": isString},
                            {"field": "descripcion", "checkFunction": isString}, 
                            {"field": "estado", "checkFunction": isString},
                            {"field": "nivelUrgencia", "checkFunction": isPositiveNumber},
                            {"field": "fechaInicio", "checkFunction": isString},
                            {"field": "fechaFinEstimada", "checkFunction": isString},
                            {"field": "costoTotal", "checkFunction": isPositiveNumber},
                            {"field": "porcentajeAsignado", "checkFunction": isPositiveNumber},
                            {"field": "usuariosAsignados", "checkFunction": isArrayOfStrings}, // Verifica que sea un array de strings
                            {"field": "proveedores", "checkFunction": isArrayOfStrings}, // Verifica que sea un array de strings
                            {"field": "ubicacion", "checkFunction": isString},
                            {"field": "donacionesRecibidas", "checkFunction": isPositiveNumber}
                            ]

                            

const reqDonadorFields = [{"field": "nombre", "checkFunction": isString},
                            {"field": "apellido", "checkFunction": isString}, 
                            {"field": "email", "checkFunction": isString}]



const reqLogInFields = [{"field": "usuario", "checkFunction": isString}, 
                        {"field": "contraseña", "checkFunction": isString}]

const reqUsuarioFields = [{"field": "usuario", "checkFunction": isString}, 
                        {"field": "contraseña", "checkFunction": isString}, 
                        {"field": "nivel_acceso", "checkFunction": isNumber1_3}]


//Funciones de checkeo del formato de JSON que necesita todos los fields (POST)
function CheckJson(fields, json)
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

export function CheckDonacion(json)
{
    return CheckJson(reqDonacionFields, json) && CheckJson(reqDonadorFields, json.donador);
    
}
    
export function CheckLogIn(json)
{
    return CheckJson(reqLogInFields, json);
}

export function CheckUsuario(json)
{
    return CheckJson(reqUsuarioFields, json);
}
//----------------
// proyect
export function CheckProyect(json)
{
    return CheckJson(reqProyectFields, json);
}

// Funciones de Check Type


function isArrayOfStrings(value) {
    return Array.isArray(value) && value.every(isString);
}
//----------------

//Funciones de checkeo del formato de JSON que necesita id y uno o mas de los fields (PUT)
function CheckJsonEdit(fields, json)
{
    if ("id" === undefined 
        || !isID(json.id)) 
    {
        return {status:false, updateFields: {}};
    }
    let uF = {};
    let count = 0;
    for (let i = 0; i < fields.length;i++)
    {
        const fieldName = fields[i].field
        const fieldValue = json[fieldName];
        if (fieldValue !== undefined )
        {
            if(!fields[i].checkFunction(fieldValue) )
            {
                return {status:false, updateFields: {}};
            }
            count++;
            uF[fieldName] = fieldValue;
        }
    }
    if (count > 0)  return {status:true, updateFields: uF}
    
    else return {status:false, updateFields: {}}

    
   
}

export function CheckDonacionEdit(json)
{
    let returnJson = CheckJsonEdit(reqDonacionFields, json);
    
    if (returnJson.updateFields.donador === undefined) return returnJson;
    
    const donador = structuredClone(returnJson.updateFields.donador);
    delete returnJson.updateFields.donador;

    for (let i = 0; i < reqDonadorFields.length; i++)
    {
        const fieldName = reqDonadorFields[i].field
        const fieldValue = donador[fieldName];
        if (fieldValue !== undefined )
        {
            if(!reqDonadorFields[i].checkFunction(fieldValue) )
            {
                return {status:false, updateFields: {}};
            }
            
            returnJson.updateFields["donador." + fieldName] = fieldValue;
        }
    }

    return returnJson;
    
}

export function CheckUsuarioEdit(json)
{
    return CheckJsonEdit(reqUsuarioFields, json);
}



// Funciones de Check Type

function isPositiveNumber(n) 
{
    return Number.isFinite(n) && n > 0;
}

function isString(s)
{
    return typeof s === 'string' && s.length > 0;
}

function isNumber1_3(n)
{
    return isPositiveNumber(n) && n >= 1 && n <= 3;
   
}

function isJSON(json)
{
    return typeof json === 'object';
}

function isID(id)
{
    return isString(id) && id.length === 24;
}

function isMetodo(metodo)
{
    return metodo === "manual" || metodo === "online";
}

function isBool(bool)
{
    return bool === true || bool === false;
}

export async function CheckBadEntries(collection, usuario, intentosPermitidos) // Regresa true si hay error, false si todo bien
{
    const check = await collection.find({"usuario": usuario}).toArray();
    return (check.length === 1 && check[0].intentos >= intentosPermitidos)
}

export async function AddBadEntry(collection, usuario)
{
    const curDate =  new Date();
    const check = await collection.find({"usuario": usuario}).toArray();
    let result = null;
      

    if (check.length === 0)
    {
        const insertJSON = 
        {
            "usuario": usuario,
            "fecha": curDate,
            "intentos": 1
        }

        result = await collection.insertOne(insertJSON);
    }
    else
    {
    const intentos = check[0].intentos;
   
    result = await collection.updateOne({"usuario": usuario}, 
    { $set: {"intentos": intentos + 1}});
    }

}

export async function ClearBadEntries(collection, minutes)
{
    const entries = await collection.find().sort({"fecha": 1}).toArray()   
    //console.log("ENTRIES", entries)

   for (let i = 0; i < entries.length; i++)
   {
    if (HasNMinPassed(minutes, entries[i].fecha))
    {
        //console.log("DELETING", entries[i])
        const result = await collection.deleteOne({ "usuario": entries[i].usuario });
    }
    else break;
   }
}   

function HasNMinPassed(m, fecha)
{
    const curDate = new Date();
    const diffMs = curDate - new Date(fecha);  // Calculate the difference in milliseconds
    const diffMins = diffMs / (1000 * 60);  // Convert milliseconds to minutes
    
    return diffMins >= m; 

}





//proyect:
// JSON de prueba para validar un proyecto
const testProject = {
    "nombre": "Construcción de Pozo en Comunidad X",
    "descripcion": "Proyecto para construir un pozo en la comunidad X.",
    "estado": "en progreso",
    "nivelUrgencia": 2,
    "fechaInicio": "2023-09-01",
    "fechaFinEstimada": "2024-03-01",
    "costoTotal": 20000,
    "porcentajeAsignado": 20,
    "usuariosAsignados": ["userId1", "userId2"],
    "proveedores": ["Proveedor A", "Proveedor B"],
    "ubicacion": "Comunidad X",
    "donacionesRecibidas": 10000
  };
  
  // Llamar a la función de validación para proyectos
  const isProjectValid = CheckProyect(testProject);
  console.log("¿Es válido el proyecto?", isProjectValid);
  
  // Puedes probar con un proyecto inválido
  const invalidProject = {
    "descripcion": "Proyecto para construir un pozo en la comunidad X.",
    "estado": "en progreso",
    "nivelUrgencia": 2,
    "fechaInicio": "2023-09-01",
    "fechaFinEstimada": "2024-03-01",
    "costoTotal": 20000,
    "porcentajeAsignado": 20,
    "usuariosAsignados": ["userId1", "userId2"],
    "proveedores": ["Proveedor A", "Proveedor B"],
    "ubicacion": "Comunidad X",
    "donacionesRecibidas": 10000
  };
  
  const isInvalidProjectValid = CheckProyect(invalidProject);
  console.log("¿Es válido el proyecto sin nombre?", isInvalidProjectValid);