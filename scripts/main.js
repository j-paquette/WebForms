//To enter mor than one email address, when more than one contact email is needed.
function onMainFormSubmit(event){
  //const csdname = document.getElementById("csdname");
  //returns the input object
  //alert(csdname.value);

  //Prevents reloading the page
  event.preventDefault();
  const data = new FormData(event.target);

  //Get all the values from the form, but doesn't include input for multiple values such as checkboxes
  const value = Object.fromEntries(data.entries());

  //The Object contains an array in topics that contains all the checked values
  value.ewsServices = data.getAll("ewsServices");
  
  //Converts the form data to json
  const jsonData = JSON.stringify(value);

  //build the headers
  const headers = buildHeaders();

  //console.log(jsonData);
  
 //Submit the data
  const request = new XMLHttpRequest();
  request.open("POST", url);
  request.send(formData);

  //go through each field and read the data from form, to build a string
  //return false;
}

/*
input id="expiryDate" should be hidden by default, unless id="expireAcct" is Yes 
*/
function hideExpiryDateOnChange(obj){
if (obj.value == "yes"){
  document.getElementById("hiddenField").hidden = false;
  //TODO: add require to expiryDate input, to make this entry mandatory
}
else
  document.getElementById("hiddenField").hidden = true;
}

/*
Build the header
*/
function buildHeaders(authorization = null) {
  const headers = {
      "Content-Type": "application/json",
      "Authorization": (authorization) ? authorization : "Bearer TOKEN_MISSING"
  };
  return headers;
}

//const mainForm=document.getElementById("mainForm");
//console.log(mainForm);
//mainForm.onsubmit=onMainFormSubmit;

/*
Event Listeners
*/
const form = document.querySelector('form');

form.addEventListener('submit', onMainFormSubmit);


