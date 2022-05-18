//To enter mor than one email address, when more than one contact email is needed.
async function onMainFormSubmit(event){
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
    //const jsonData = JSON.stringify(value);
      
    //console.log(jsonData);
  
    //POST implementation    
    const response = await fetch('https://reqres.in/api/users', {
        method: 'POST',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value),
    });
    return response.json(); 
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
  
  //const mainForm=document.getElementById("mainForm");
  //console.log(mainForm);
  //mainForm.onsubmit=onMainFormSubmit;
  
  const form = document.querySelector('form');
  
  form.addEventListener('submit', onMainFormSubmit);
  
  
  