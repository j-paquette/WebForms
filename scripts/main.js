/*
  This function:
  collects users entered data into formValue obj
  configures the POST request to the EWS Support project, as a new issue using the GitLab API
  TODO: this function should call the other functions
*/
async function onMainFormSubmit(event){  
  try {
    //Prevents reloading the page
    event.preventDefault();
    const data = new FormData(event.target);
  
    //Get all the values from the form, but doesn't include input for multiple values such as checkboxes
    //TODO: add optional field for user to add their GitLab username. I can then add 
    //TODO: create a new function, along with formValue.ewsServices, called getFormValue. Takes data as parameter and returns formValue.
    const formValue = Object.fromEntries(data.entries());
  
    //The Object contains an array in topics that contains all the checked values
    //TODO: should be in a separate function, along with formValue.ewsServices, called getFormValue. Takes data as parameter and returns formValue
    formValue.ewsServices = data.getAll("ewsServices");
 
    //TODO: add object(const issueData) that contains all the necessary attributes to create a new issue in GitLab description (in markdown format)
    ///?title=Prod: Request new account access&labels=New Account, PROD&confidential=true&description=This is a short description   &state=opened&assignee_id=1032'
    //TODO: separate this into a new function called getIssueData(formData) and returns issueData
    const issueData = {
      title: "Prod: Request new account access",
      description: `This is a short description

| Application Info | |
| ------ | ------ |
| **Application Environment** | ${formValue.environment} |
| **CSD Application Name** | ${formValue.csdName} |
| **CSD Acronym** | ${formValue.csdAcronym} |
| **Application Type** | ${formValue.appType} |
| **Application Zone** | ${formValue.appZone} |
| **Application Description** | ${formValue.appDesc} |`
    };

    //POST implementation  
    //TODO: separate into a function createIssue(issueData) and return await response.json()  
    const response = await fetch('https://gccode.test.ssc-spc.gc.ca/api/v4/projects/11015/issues', {
        method: 'POST',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json',
            //For now, no need to hide the token value because it only allows access to users to create/edit an issue, nothing more.
            //Maybe later on, if we want to use WSEMail to send our notification emails (instead of thru GitLab), we'll need to lock it down (using JWT tokens??)
            //If GitHub returns an error because it won't allow me to send a private token as plain text, then I will need to do a GET of API token and send response with the token 
            'PRIVATE-TOKEN': 'Jh7Y-uuxM2eETchK6ifg'
        },
        //stringify only the issue body info
        body: JSON.stringify(issueData),
    });
    //Display message to the user that form was submitted successfully
    //TODO: parse response for successful submit (include the url in the response) 
    const displayMessage = document.getElementById("displayMessage");
    const responseData = await response.json();

    //TODO: create a separate function for showMessages 
    displayMessage.innerHTML = `Your request has been submitted. You can view it here: <a href="${responseData.web_url}">${responseData.web_url}</a>`;  
  }
   catch(error){ 
     //TODO: create a separate function for showMessages    
     const displayMessage = document.getElementById("displayMessage");
    
     displayMessage.innerHTML = 'Unable to contact GCcode, make sure you are connected to the ESDC network.';  
   } 

  }
  
  /*
    This function sets the expiryDate input field as hidden by default.
    If the user answers: expireAcct=Yes, then expiryDate field is displayed
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
    This function  returns the displayMessage element to create custom messages for the user 
  */
  /* function showMessages(awaitResponseJson){
    const displayMessage = document.getElementById("displayMessage");
  
    const awaitResponseJson = responseData

     //Checks if responseData= true?? then display the success message, otherwise display the error message
    if (responseData == true ) {
      displayMessage.innerHTML = `Your request has been submitted. You can view it here: <a href="${responseData.web_url}">${responseData.web_url}</a>`;  
    }
    else {
    displayMessage.innerHTML = 'Unable to contact GCcode, make sure you are connected to the ESDC network.';  
    }

    return displayMessage.innerHTML;
   }; */
 
  /*
    This function submits the user's web form data when user presses the submit button
  */
  function sdsRequestInitForm() {
    const form = document.querySelector('form');
  
    form.addEventListener('submit', onMainFormSubmit);
  }

  //Call the function to submit the form 
  sdsRequestInitForm();
  
  
  
  