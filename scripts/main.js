//To enter mor than one email address, when more than one contact email is needed.
function onMainFormSubmit(event){
  //const csdname = document.getElementById("csdname");
  //returns the input object
  //alert(csdname.value);

  event.preventDefault();

  const data = new FormData(event.target);
  //Get all the values from the form, but doesn't include input for multiple values such as checkboxes
  const value = Object.fromEntries(data.entries());

  //The Object contains an array in topics that contains all the checked values
  value.ewsServices = data.getAll("ewsServices");
    
  console.log({value});

  //to prevent form from submitting (refreshing page)
  //go through each field and read the data from form, to build a string
  return false;
}

//input id="expiryDate" should be hidden by default, unless id="expireAcct" is Yes 
function hideExpiryDateOnChange(obj){
if (obj.value == "yes"){
  document.getElementById("hiddenField").hidden = false;
  //add require to expiryDate input
}
else
  document.getElementById("hiddenField").hidden = true;
}

//const mainForm=document.getElementById("mainForm");
//console.log(mainForm);
//mainForm.onsubmit=onMainFormSubmit;

const form = document.querySelector('form');

form.addEventListener('submit', onMainFormSubmit);


