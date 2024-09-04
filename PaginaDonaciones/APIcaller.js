document.getElementById('donation-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log("PRESSED!");
    const formData = new FormData(this);

    // Convert FormData to a plain object
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log(data);
})