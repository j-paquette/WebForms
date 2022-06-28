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

    //const issueData = getIssueDataGCcode(issueData);
    //Calls createIssueGCcode(getIssueDataGCcode(issueData, formValue) and returns web form data to GCcode Issue Description section  
    //const responseData = await createIssueGCcode(getIssueDataGCcode(formValue), formValue);
    
    const issueData = getWorkItemDataADO(formValue);
    //Calls createWorkItemADO(issueData, formValue) and returns web form data to ADO Work Item Description section
    const responseData = await createWorkItemADO(issueData, formValue);

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
 function getIssueDataGCcode(formValue) {

  const issueDataGCcode = {
  title: `${formValue.environment}: Request access to ${formValue.ewsServices}`,
  confidential: "true",
  labels: `New, ${formValue.environment}, ${formValue.ewsServices} `,
  description: `${formValue.appDesc}

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
    return issueDataGCcode;
 }

  /*
  This function creates a new issue in GCcode using the GitLab API, and return await response.json()
  */
  async function createIssueGCcode(issueData, formValue) {

    issueData = getIssueDataGCcode(formValue);

    const response = await fetch('https://gitlab.com/api/v4/projects/36888795/issues', {
        method: 'POST',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json',
            //Uses PRIVATE-TOKEN to authorize creating a new issue thru the GitLab API
            'PRIVATE-TOKEN': 'glpat-8TZ_SsUyJYBh1N1-GkSg'
        },
        //stringify only the issue body info
        body: JSON.stringify(issueData),
    });

    const responseData = await response.json();

    return convertGCcodeResponseValues(responseData);
  }

  /* 
  This function returns common response values specific to GCcode
  */
  function convertGCcodeResponseValues(responseData){
    const resultValues = {
      issueUrl: responseData.web_url
    };

    return resultValues;

  }


 /*
  This function gets the form data entered by the user (as a parameter) and returns issueData
 */
 function getWorkItemDataADO(formValue) {

  const issueDataADO = 
    [
      {
        "op": "add",
        "path": "/fields/System.Title",
        "from": null,
        "value": `${formValue.environment}: Request access to ${formValue.ewsServices}`
      },
      {
        "op": "add",
        "path": "/fields/System.Tags",
        "from": null,
        "value": `New Account, ${formValue.environment}, ${formValue.ewsServices}` 
      },
      {
        "op": "add",
        "path": "/fields/System.State",
        "from": null,
        "value": "New-Nouveau"
      },
      {
        "op": "add",
        "path": "/fields/System.AreaPath",
        "from": null,
        "value": "DevCoP-CdpDev"
      },
      {
        "op": "add",
        "path": "/fields/System.Description",
        "from": null,
        "value": `${formValue.environment}`
      }
           
    ]
    return issueDataADO;
  }


  /*
  This function creates a new issue in Azure DevOps (ADO), includes web form data getWorkItemDataADO(formValue) using the ADO API header info, and return await response.json()
  TODO: Can I refactor to make this a closure function, and nest createWorkItemADO(issueData) inside getWorkItemADO(formValue)??
  This gives createWorkItemADO(issueData) full access to all the variables & functions in getWorkItemADO(formValue) 
  and all the variables & functions getWorkItemADO(formValue) has access to.
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#closures
  */
  async function createWorkItemADO(issueData, formValue) {
    //Call getWorkItemDataADO(formValue), to get the web form data, all in the one function
    issueData = getWorkItemDataADO(formValue); 

    const response = await fetch("https://ado.intra.dmz/projectcollection/DevCoP-CdpDev/_apis/wit/workitems/$Task-T%C3%A2che?api-version=6.0", {
        method: "POST",
        cache: "default",
        headers: {
            "Content-Type": "application/json-patch+json",
            //ADO base64 encoded authorization of the Personal Access Token to create Work Items (read & write)
            "Authorization": `Basic ${btoa("snuvckjdwqinkultvfzggslb7x6q3v6alfm43jp5pqkb3jpomhgq:")}`
        },
        //stringify only the issue body info
        body: JSON.stringify(issueData),
    });

    const responseData = await response.json();

    return convertADOResponseValues(responseData);
  }


  /*
    This function returns common response values specific to ADO
  */
  function convertADOResponseValues(responseData){
    const resultValues = {
      issueUrl: responseData._links.html.href
    };

    return resultValues;
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
  
  
  
  