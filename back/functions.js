
const reqDonacionFields = ["monto", "fecha", "donador"]
const reqDonadorFields = ["nombre", "apellido", "email"]
const reqLogInFields = ["usuario", "contraseña"]

export function CheckJSONNewDonation(json)
{
    for(let i = 0; i < reqDonacionFields.length; i++)
    {
        if (json[reqDonacionFields[i]] === undefined)
        {
            return false;
        }
    }
    for(let i = 0; i < reqDonadorFields.length; i++)
    {        
        if (json.donador[reqDonadorFields[i]] === undefined)
        {
            return false;
        }
    }
    return true;
}
    
export function CheckLogIn(json)
{
    for(let i = 0; i < reqLogInFields.length; i++)
    {
        if (json[reqLogInFields[i]] === undefined)
        {
            return false;
        }
    }
    return true;
}
