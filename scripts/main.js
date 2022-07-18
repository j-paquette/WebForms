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

    const issueApi = new IssueApi();

    //const issueData = getIssueDataGCcode(issueData);
    //Calls createIssueGCcode(getIssueDataGCcode(issueData, formValue) and returns web form data to GCcode Issue Description section  
    //const responseData = await createIssueGCcode(getIssueDataGCcode(formValue), formValue);
    
    //Calls createWorkItemADO(issueData, formValue) and returns web form data to ADO Work Item Description section
    const responseData = await issueApi.createWorkItem(formValue);

    console.log(responseData); 

    showMessage(`Your request has been submitted. You can view it here: <a href="${responseData.issueUrl}">${responseData.issueUrl}</a>`, "success")
  }
   catch(error){ 
    
    showMessage("Unable to contact GCcode, make sure you are connected to the ESDC network.", "error"); 
   } 
  }
  

  /*
    This function sets the expiryDate input field as hidden by default.
    If the user answers: expireAcct=Yes, then expiryDate field is displayed
  */
  function hideExpiryDateOnChange(obj){
    //TODO: check if the data is cached before running the if statement. 
   
    if (obj.value == "yes"){
      document.getElementById("expiryDateContainer").hidden = false;
      //TODO: add require to expiryDate input, to make this entry mandatory
    }
    else {
      document.getElementById("expiryDateContainer").hidden = true;
    }
      
  }

  /*
    This function displays to the user the request as Non-production(nonProd) New by default
    Depending on the following combination of choices, the web form will display data entry fields ONLY relevant to the type of request/environment:
    - nonProd, new: Only the questions(elements) with id="newNonProd" and questions common to all request types (no div id) will be displayed. This is the default setting.  
    - nonProd, modify: Only the questions(elements) with id="modifyNonProd" and questions common to all request types (no div id) will be displayed.
    - prod, new: Only the questions(elements) with id="newProd" and questions common to all request types (no div id) will be displayed.
    - prod, modify: Only the questions(elements) with id="modifyProd" and questions common to all request types (no div id) will be displayed.
  */
  function showQuestionsOnchange(element){
    //by default
    if(element.value=="newNonProd"){
      //if they select "newNonProd", unhide the questions/fields related to a new nonProd request, and activate the "required" questions
      document.getElementById("newNonProd").hidden = false;
    }
    //TODO: How do I know which question I'm at??
    else if(element.value=="Yes"){
      //if they select both "modifyNonProd", unhide the questions/fields related to a modify nonProd request, and activate the "required" questions
      document.getElementById("modifyNonProd").hidden = false;
    }
    else if(element.value=="newProd"){
      //if user selects both "newProd", unhide the questions/fields related to a new Prod request, and activate the "required" questions
      document.getElementById("newProd").hidden = false;
    }
    else if(element.value=="modifyProd"){
      //if they select both "modifyProd", unhide the questions/fields related to a modify Prod request, and activate the "required" questions 
      document.getElementById("modifyProd").hidden = false;
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
    This function  returns the displayMessage element to create custom messages for the user 
    MessageType can be one of: "Error", "Warning" or "success"
  */
  function showMessage(message, messageType){
    const displayMessage = document.getElementById("displayMessage");

    displayMessage.innerHTML = message;
    if (messageType == "success" ) {
      displayMessage.className = "message successMessage"; 
    }
    else if(messageType == "error"){
      displayMessage.className = "message errorMessage"; 
    }
    else if (messageType == "warning") {
      displayMessage.className = "message warningMessage"; 
    }
    else {
      displayMessage.className = "message informationMessage"; 
    }
  
   }
 

  /*
    This function submits the user's web form data when user presses the submit button
  */
  function sdsRequestInitForm() {
    const form = document.querySelector('form');
  
    form.addEventListener('submit', onMainFormSubmit);

    //This will initialize the global event handlers (ie, onchange, etc) in the HTML, when it has finished loading
    //Fixed: When I refreshed the browser to retest the same data (cached data=YES), it was still set to yes but the date field was hidden
    document.addEventListener('DOMContentLoaded', (event)=> {
      hideExpiryDateOnChange(document.getElementById("expireAcct"));
      //Can add other items here...
    })
  }

  //Call the function to submit the form 
  sdsRequestInitForm();
  
  
  
  