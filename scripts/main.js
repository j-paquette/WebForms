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
  
    //Calls getFormValue that takes data as parameter and returns formValue.
    const formValue = getFormValue(data);

    //Calls getClientIssueData(formData) and returns issueData
    const issueData = getClientIssueData(formValue);

    const responseData = createIssueGCcode(issueData);

    //POST implementation  
    //TODO: separate into a function createIssue(issueData) and return await response.json() 
    //TODO: update the api Url to GCcode, when GCcode is available: https://gccode.ssc-spc.gc.ca/api/v4/projects/11015/issues
    //TODO: redirect the POST to GitLab account until GCcode connection issues are resolved: https://gitlab.com/api/v4/projects/36860236/issues 
    // const response = await fetch('https://gitlab.com/api/v4/projects/36888795/issues', {
    //     method: 'POST',
    //     cache: 'default',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         //For now, no need to hide the token value because it only allows access to users to create/edit an issue, nothing more.
    //         //Maybe later on, if we want to use WSEMail to send our notification emails (instead of thru GitLab), we'll need to lock it down (using JWT tokens??)
    //         //If GitHub returns an error because it won't allow me to send a private token as plain text, then I will need to do a GET of API token and send response with the token 
    //         'PRIVATE-TOKEN': 'glpat-8TZ_SsUyJYBh1N1-GkSg'
    //     },
    //     //stringify only the issue body info
    //     body: JSON.stringify(issueData),
    // });
    //Display message to the user that form was submitted successfully
    //TODO: parse response for successful submit (include the url in the response) 
    const displayMessage = document.getElementById("displayMessage");
    //calls showMessage(message, messageType) and returns the message text, MessageType=successMessage
    //const showMessage = displayMessage.innerHTML.showMessage(message, successMessage);
    //const [message, messageType] = showMessage();
    //const showMessage = showMessage();
    //const successMessage = showMessage[0];
    //const responseData = await response.json();

    //TODO: create a separate function for showMessages 
    displayMessage.innerHTML = `Your request has been submitted. You can view it here: <a href="${responseData.web_url}">${responseData.web_url}</a>`;
    //displayMessage.innerHTML = successMessage.message, `"<a href="${responseData.web_url}">${responseData.web_url}</a>`;

    displayMessage.className = "message successMessage"; 
  }
   catch(error){ 
     //TODO: create a separate function for showMessages    
     //const displayMessage = document.getElementById("displayMessage");
     //const errorMessage = showMessage(message, errorMessage);
     displayMessage.innerHTML = "Unable to contact GCcode, make sure you are connected to the ESDC network."; 
     //displayMessage.innerHTML = showMessage(message);
     displayMessage.className = "message errorMessage"; 
   } 

  }
  
  /*
    This function sets the expiryDate input field as hidden by default.
    If the user answers: expireAcct=Yes, then expiryDate field is displayed
  */
  function hideExpiryDateOnChange(obj){
    //TODO: check if the data is cached before running the if statement. 
    //When I refreshed the browser to retest the same data (cached data=YES), it was still set to yes but the date field was hidden

    if (obj.value == "yes"){
      document.getElementById("expiryDateContainer").hidden = false;
      //TODO: add require to expiryDate input, to make this entry mandatory
    }
    else {
      document.getElementById("expiryDateContainer").hidden = true;
    }
      
  }

  
  /*Hide message returned to user, after they've submitted their data*/
  function hideMessage() {
    document.getElementById("displayMessage").className="hiddenMessage";
  }


  /*
    This function gets the form data submitted by the user (as a parameter) and returns formValue
  */
  function getFormValue(formData) {
    //Get all the values from the form, but doesn't include input for multiple values such as checkboxes
    const formValue = Object.fromEntries(formData.entries());

    //The Object contains an array in topics that contains all the checked values
    formValue.ewsServices = formData.getAll("ewsServices");

    return formValue;
 }


 /*
  This function gets the form data entered by the user (as a parameter) and returns issueData
 */
 function getClientIssueData(formValue) {

 //TODO: add labels depending on the type of request (new, modify, non-production, production, WSAddress, WSEMail, WSED, WSDBLink)
  const issueData = {
  title: "Prod: Request new account access",
  confidential: "true",
  description: `This is a short description

| Application Info | |
| ------ | ------ |
| **Application Environment** | ${formValue.environment} |
| **CSD Application Name** | ${formValue.csdName} |
| **CSD Acronym** | ${formValue.csdAcronym} |
| **Application Type** | ${formValue.appType} |
| **Application Zone** | ${formValue.appZone} |
| **Application Description** | ${formValue.appDesc} |

| Contact Information | |
| ------ | ------ |
| **Director's Name** | ${formValue.dirName} |
| **Director's Email** | ${formValue.dirEmail} |
| **Manager's Name** | ${formValue.mgrName} |
| **Manager's Email** | ${formValue.mgrEmail} |
| **Team Lead's Name** | ${formValue.tlName} |
| **Team Lead's Email** | ${formValue.tlEmail} |
| **Additional Contact Name(s)** | ${formValue.addNames} |
| **Additional Contact Email(s)** | ${formValue.addMails} |

| EWS Information | |
| ------ | ------ |
| **Which service(s) do you need access to?** | ${formValue.ewsServices} |
| **Should the account expire?** | ${formValue.expireAcct} |
| **If yes, please provide the expiry date** | ${formValue.expiryDate} |`
    };
    return issueData;
 }

  /*
  This function creates a new issue in GCcode using the GitLab API, and return await response.json()
  */
  async function createIssueGCcode(issueData) {
    const response = await fetch('https://gitlab.com/api/v4/projects/36888795/issues', {
        method: 'POST',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json',
            //For now, no need to hide the token value because it only allows access to users to create/edit an issue, nothing more.
            //Maybe later on, if we want to use WSEMail to send our notification emails (instead of thru GitLab), we'll need to lock it down (using JWT tokens??)
            //If GitHub returns an error because it won't allow me to send a private token as plain text, then I will need to do a GET of API token and send response with the token 
            'PRIVATE-TOKEN': 'glpat-8TZ_SsUyJYBh1N1-GkSg'
        },
        //stringify only the issue body info
        body: JSON.stringify(issueData),
    });

    const responseData = await response.json();

    return responseData;
  }

  /*
    This function  returns the displayMessage element to create custom messages for the user 
    MessageType can be one of: "Error", "Warning" or "success"
  */
  function showMessage(message, messageType){
    //const displayMessage = document.getElementById("displayMessage");
  
    //const message = displayMessage.innerHTML;

    //const errorMessage = "Unable to contact GCcode, make sure you are connected to the ESDC network.";  
    //const successMessage = `Your request has been submitted. You can view it here: <a href="${responseData.web_url}">${responseData.web_url}</a>`;
    //const warningMessage = "Your request has been submitted with warnings."
    //Checks if responseData= true?? then display the success message, otherwise display the error message
    if (messageType == successMessage ) {
      message = "Your request has been submitted. You can view it here: "; 
    }
    else if(messageType == errorMessage){
      message = "Unable to contact GCcode. Make sure you are connected to the ESDC network, or that GCcode is available.";
    }
    else
      message = "Your request has been submitted with warnings. Please review your information before submitting.";

    return message, messageType;
   }
 
 
 
  /*
    This function submits the user's web form data when user presses the submit button
  */
  function sdsRequestInitForm() {
    const form = document.querySelector('form');
  
    form.addEventListener('submit', onMainFormSubmit);

    //This will initialize the global event handlers (ie, onchange, etc) in the HTML, when it has finished loading
    document.addEventListener('DOMContentLoaded', (event)=> {
      hideExpiryDateOnChange(document.getElementById("expireAcct"));
      //Can add other items here
    })
  }

  //Call the function to submit the form 
  sdsRequestInitForm();
  
  
  
  