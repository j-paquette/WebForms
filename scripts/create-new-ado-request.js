//Top level function that loads the JSON into our script, and use some DOM manipulation to display it
async function onMainFormSubmit(event){
    //initialize a new request object
    try{
    //Prevents reloading the page
    event.preventDefault();

    const data = new FormData(event.target);
    //Calls getFormValue that takes data as parameter and returns formValue.
    const formValue = getFormValue(data);

    const request = new Request(requestData);

    const response = await fetch(request);

    const responseData = createWorkItemADO(getWorkItemDataADO);

    }
    catch(error){

    }

}

function getClientWorkItemDataADO(obj){
    const issueData = { "clientData":
        [ 
          {
            "op": "add",
            "path": "/fields/System.Title",
            "from": null,
            "value": "Prod: Request new account access"
          },
          {
            "op": "add",
            "path": "/fields/System.Tags",
            "from": null,
            "value": "New Account, PROD" 
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
            "value": "This is a short description"
          },
          {
            description: `This is a short description ${formValue['environment']}`
          }      
        ]}
    
}
