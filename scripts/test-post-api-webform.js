function submitForm(event) {
    // Prevent the form from submitting.
    event.preventDefault();
    // Set url for submission and collect data.
    const url = "https://reqres.in/api/users";
    const formData = new FormData(event.target);
    // Build the data object.
    const data = {};
    //data.textContent = JSON.stringify(data, null, ' ');

    formData.forEach((value, key) => (data[key] = value));

    // Log the data.
    //console.log(data);

    // Submit the data.
    const request = new XMLHttpRequest();
    request.open("POST", url);
    request.send(formData);
  }

  