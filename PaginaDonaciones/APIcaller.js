document.getElementById('donation-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log("PRESSED!");
    const currentDate = new Date();
    let json = {
        "monto": 0,
        "fecha": "",
        "donador": {
          "nombre": "",
          "apellido": "",
          "email": ""
        }
      }

    json.donador.nombre = document.getElementById('nombre').value;
    json.donador.apellido = document.getElementById('apellido').value;
    json.donador.email = document.getElementById('correo').value;
    json.monto = document.getElementById('monto').value;
    json.fecha = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;


    //console.log(`Nombre: ${json.donador.nombre}\nApellido: ${json.donador.apellido}\nEmail: ${json.donador.correo}\nMonto: ${json.monto}\nFecha: ${json.fecha}\n`);
    //console.log(currentDate);
    console.log(json);

    console.log("FETCHING!");
    fetch("http://localhost:3000/donaciones", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
        })
  .then(response => response.json())
  .then(data => {
    console.log("Todo created:", data);

    if (data.status)
    {
      SuccessMessage(json.donador.nombre);
    }
    else{
      UnsuccessMessage();
    }
  })
  .catch(error => {
    console.log("Error:", error);
    UnsuccessMessage();
  });

    
})

function SuccessMessage(nombre)
{    
    const container =document.getElementById('main-container');
    container.innerHTML = `<p>¡Muchas gracias por tu donación ${nombre}!</p>
                            <button>Back</button>`; 


}


function UnsuccessMessage(nombre)
{
  const container =document.getElementById('main-container');
  container.innerHTML = `<p>Error!</p>`;
}