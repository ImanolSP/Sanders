let originalHTML;
AddDonationEvent();


function AddDonationEvent()
{
  document.getElementById('donation-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    originalHTML = document.getElementById('main-container').innerHTML;
    
    console.log("PRESSED!");
    const currentDate = new Date();
    let json = {
      "monto": 0,
      "fecha": "",
      "metodo": "online",
      "editado": false,
      "donador": {
        "nombre": "",
        "apellido": "",
        "email": ""
      }
    }
    
    json.donador.nombre = document.getElementById('nombre').value;
    json.donador.apellido = document.getElementById('apellido').value;
    json.donador.email = document.getElementById('correo').value;
    json.monto = parseInt(document.getElementById('monto').value, 10);
    json.fecha = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    
    
    //console.log(`Nombre: ${json.donador.nombre}\nApellido: ${json.donador.apellido}\nEmail: ${json.donador.correo}\nMonto: ${json.monto}\nFecha: ${json.fecha}\n`);
    //console.log(currentDate);
    console.log(json);
    
    console.log("FETCHING!");
    fetch("https://localhost:3000/donaciones", {
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
        Message(`¡Muchas gracias por tu donación ${json.donador.nombre}!`)
        //SuccessMessage(json.donador.nombre);
      }
      else{
        //UnsuccessMessage();
        Message("¡Hubo un error!")
      }
      //AddEventToBackButton();
    })
    .catch(error => {
      console.log("Error:", error);
      //UnsuccessMessage();
      //AddEventToBackButton();
      Message("¡Hubo un error!")
    });
    
  })
  
}

function Message(text)
{    
    const container = document.getElementById('main-container');
    container.innerHTML = `<h2>${text}</h2>`;
    
    const backButton = document.createElement("button");
    backButton.innerHTML = "Back"

    backButton.addEventListener("click", function(event){
      const container =document.getElementById('main-container');
      container.innerHTML = originalHTML;
      AddDonationEvent();
    });

    container.appendChild(backButton);
}
