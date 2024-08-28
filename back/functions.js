
const reqDonacionFields = ["monto", "fecha", "donador"]
const reqDonadorFields = ["nombre", "apellido", "email"]

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
    

