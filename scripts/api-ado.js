class IssueApi {
    /*
  This function gets the form data entered by the user (as a parameter) and returns issueData
    */
 getWorkItemData(formValue) {

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
          "value": `
          <style>
table {
  border-collapse: collapse;
  border: 1px solid #dbdbdb;
  font-size: 0.875rem;
}

.column-header {
  background-color: #f0f0f0;
  border-bottom: 2px solid rgb(200, 200, 200);
  font-weight: bold;
}

.row-header {
  font-weight: bold;
}

td, th, tr {
  border: 1px solid #dbdbdb;
  padding: 10px 20px;
  text-align: left;
  overflow-wrap: break-word;
}

caption {
  padding: 10px;
}
          </style>
          <p>
          <table>
            <thead>
              <tr id="appInfo" class="column-header" scope="column">
                <th>Application Info</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th id="environment" class="row-header" scope="row">Application Environment</th>
                <td>${formValue.environment}</td>
              </tr>
              <tr>
                <th id="csdName" class="row-header" scope="row">CSD Application Name</th>
                <td>${formValue.csdName}</td>
              </tr>
              <tr>
                <th id="csdAcronym" scope="row-header" scope="row">CSD Acronym</th>
                <td>${formValue.csdAcronym}</td>
              </tr>
              <tr>
                <th id="appType" class="row-header" scope="row">Application Type</th>
                <td>${formValue.appType}</td>
              </tr>
              <tr>
                <th id="appZone" class="row-header" scope="row">Application Zone</th>
                <td>${formValue.appZone}</td>
              </tr>
              <tr>
                <th id="appDesc" class="row-header" scope="row">Application Description</th>
                <td>${formValue.appDesc}</td>
              </tr>
            </tbody>
          </table>
          </p>`
        }
             
      ]
      return issueDataADO;
    }

    // /*
    // This function creates a link element to apply sample-html-table.css file to the html
    // */
    // createHtmlLinkElement(linkElement){
    //   //create a new link element
    //   const link = document.createElement("Link");

    //   link.rel = "stylesheet";
    //   link.type = "text/css";
    //   link.href = "sample-html-table.css";

    //   //Get the html HEAD element to append the link element to it
    //   document.getElementsByTagName("head")[0].appendChild(link);

    //   return linkElement;
    // }
  
  
    /*
    This function creates a new issue in Azure DevOps (ADO), includes web form data getWorkItemDataADO(formValue) using the ADO API header info, and return await response.json()
    TODO: Can I refactor to make this a closure function, and nest createWorkItemADO(issueData) inside getWorkItemADO(formValue)??
    This gives createWorkItemADO(issueData) full access to all the variables & functions in getWorkItemADO(formValue) 
    and all the variables & functions getWorkItemADO(formValue) has access to.
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#closures
    */
    async createWorkItem(formValue) {
      //Call getWorkItemDataADO(formValue), to get the web form data, all in the one function
      const issueData = this.getWorkItemData(formValue); 
  
      const response = await fetch("https://ado.intra.dmz/projectcollection/DevCoP-CdpDev/_apis/wit/workitems/$Task-T%C3%A2che?api-version=6.0", {
          method: "POST",
          cache: "default",
          headers: {
              "Content-Type": "application/json-patch+json",
              //ADO base64 encoded authorization of the Personal Access Token to create Work Items (read & write)
              //TODO: ADO has a bug that expires after 30days (even though I chose custom date), create a PAT with a default expiration date (30/60/90 days)
              "Authorization": `Basic ${btoa("g7lchuq7w7r7lvlptwtjhfcxnhb2emp7evxhqka577qmkyupfl6a:")}`
          },
          //stringify only the issue body info
          body: JSON.stringify(issueData),
      });
  
      const responseData = await response.json();
  
      return this.convertResponseValues(responseData);
    }
  
  
    /*
      This function returns common response values specific to ADO
    */
    convertResponseValues(responseData){
      const resultValues = {
        issueUrl: responseData._links.html.href
      };
  
      return resultValues;
    }
}
