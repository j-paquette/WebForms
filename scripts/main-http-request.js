//To enter mor than one email address, when more than one contact email is needed.
function onMainFormSubmit(event){
    //const csdname = document.getElementById("csdname");
    //returns the input object
    //alert(csdname.value);
  
    //Prevents reloading the page
    event.preventDefault();
    const XHR = new XMLHttpRequest();
    const data = new FormData(event.target);
  
    //Get all the values from the form, but doesn't include input for multiple values such as checkboxes
    const value = Object.fromEntries(data.entries());
  
    //The Object contains an array in topics that contains all the checked values
    value.ewsServices = data.getAll("ewsServices");
    
    //Converts the form data to json
    const jsonData = JSON.stringify(value);
      
    //console.log(jsonData);
  
    //When the form is submitted successfully
    XHR.addEventListener( 'load', function( event ) {
      alert( 'Yay! Data sent and response loaded.' );
    } );
  
    // Define what happens in case of error
    XHR.addEventListener(' error', function( event ) {
      alert( 'Oops! Something went wrong.' );
    } );
  
    // Set up our request
    XHR.open( 'POST', 'https://reqres.in/api/users');
    
    //Add the header for POST requests
    XHR.setRequestHeader('Content-type', 'application/json');

    // Send our FormData object; HTTP headers are set automatically
    XHR.send(jsonData);
  
  
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
  
  
  