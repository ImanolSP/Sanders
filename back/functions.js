
const reqDonacionFields = [{"field": "monto", "checkFunction": isPositiveNumber}, 
                            {"field": "fecha", "checkFunction": isString},
                            {"field": "donador", "checkFunction": isJSON}]


const reqDonadorFields = [{"field": "nombre", "checkFunction": isString},
                            {"field": "apellido", "checkFunction": isString}, 
                            {"field": "email", "checkFunction": isString}]


const reqLogInFields = [{"field": "usuario", "checkFunction": isString}, 
                        {"field": "contraseña", "checkFunction": isString}]

const reqUsuarioFields = [{"field": "usuario", "checkFunction": isString}, 
                        {"field": "contraseña", "checkFunction": isString}, 
                        {"field": "nivel_acceso", "checkFunction": isNumber1_3}]


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

export function CheckJSONNewDonation(json)
{
    return checkJson(reqDonacionFields, json) && checkJson(reqDonadorFields, json.donador);
    
}
    
export function CheckLogIn(json)
{
    return checkJson(reqLogInFields, json);
}

export function CheckUsuario(json)
{
    return checkJson(reqUsuarioFields, json);
}

// Funciones de Check

export function isPositiveNumber(n) 
{
    if (!Number.isFinite(n) || n <= 0) return false;
    return true;
}

export function isString(s)
{
    return typeof s === 'string' && s.length > 0;
}

export function isNumber1_3(n)
{
    if (isPositiveNumber(n) && n >= 1 && n <= 3)
    {
        return true;
    }
    return false;
}

export function isJSON(json)
{
    if (typeof json === 'object') return true;
    return false;
}
