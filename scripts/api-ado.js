class IssueApi {
  /**
    This function gets the form data entered by the user (as a parameter) and returns issueData.
    @param formValue The web form data formatted to HTML tables
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
          </p>
          <p>
          <table>
            <thead>
              <tr id="contactInfo" class="column-header" scope="column">
                <th>Contact Information</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th id="dirName" class="row-header" scope="row">Director's Name</th>
                <td>${formValue.dirName}</td>
              </tr>
              <tr>
                <th id="dirEmail" class="row-header" scope="row">Director's Email</th>
                <td>${formValue.dirEmail}</td>
              </tr>
              <tr>
                <th id="mgrName" scope="row-header" scope="row">Manager's Name</th>
                <td>${formValue.mgrName}</td>
              </tr>
              <tr>
                <th id="mgrEmail" class="row-header" scope="row">Manager's Email</th>
                <td>${formValue.mgrEmail}</td>
              </tr>
              <tr>
                <th id="tlName" class="row-header" scope="row">Team Lead's Name</th>
                <td>${formValue.tlName}</td>
              </tr>
              <tr>
                <th id="tlEmail" class="row-header" scope="row">Team Lead's Email</th>
                <td>${formValue.tlEmail}</td>
              </tr>
              <tr>
                <th id="addNames" class="row-header" scope="row">Additional Contact Name(s)</th>
                <td>${formValue.addNames}</td>
              </tr>
              <tr>
                <th id="addMails" class="row-header" scope="row">Additional Contact Email(s)</th>
                <td>${formValue.addMails}</td>
              </tr>
            </tbody>
          </table>
          </p>
          <p>
          <table>
            <thead>
              <tr id="ewsInfo" class="column-header" scope="column">
                <th>EWS Information</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th id="whichService" class="row-header" scope="row">Which service(s) do you need access to?</th>
                <td>${formValue.ewsServices}</td>
              </tr>
              <tr>
                <th class="row-header" scope="row">Should the account expire?</th>
                <td>${formValue.expireAcct}</td>
              </tr>
              <tr>
                <th scope="row-header" scope="row">If yes, please provide the expiry date</th>
                <td>${formValue.expiryDate}</td>
              </tr>
            </tbody>
          </table>
          </p>`
        }
             
      ]
      return issueDataADO;
    }
  
  /**
    This function does a fetch of the web form data, POST the header info and web form data as .json .
    @param formValue The web form data formatted to HTML tables
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
              //TODO: create a PAT with a default expiration date (30/60/90 days). ADO triggered an HTTPS 401 saying my PAT had expired, even though the expiry date is a week from now, maybe because I chose a custom date??
              "Authorization": `Basic ${btoa("g7lchuq7w7r7lvlptwtjhfcxnhb2emp7evxhqka577qmkyupfl6a:")}`
          },
          //stringify only the issue body info
          body: JSON.stringify(issueData),
    });
  
    const responseData = await response.json();
  
    return this.convertResponseValues(responseData);
  }
  
  
  /**
    This function returns common response values specific to ADO.
    @param responseData The ADO api response values
  */
  convertResponseValues(responseData){
    const resultValues = {
      issueUrl: responseData._links.html.href
      };
  
    return resultValues;
  }
}
