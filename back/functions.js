
const reqDonacionFields = [{"field": "monto", "checkFunction": isPositiveNumber}, 
                            {"field": "fecha", "checkFunction": isString},
                            {"field": "metodo", "checkFunction": isMetodo},
                            {"field": "editado", "checkFunction": isBool},
                            {"field": "donador", "checkFunction": isJSON}]


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