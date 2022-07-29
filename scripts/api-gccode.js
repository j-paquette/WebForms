class IssueApi {
  /**
    This function gets the form data entered by the user (as a parameter) and returns issueData.
    @param formValue The web form data formatted to markdown tables
 */
  getIssueData(formValue) {
    //TODO: change from Markdown to HTML table - see if this works. It'll be easier to identify the field values by id instead.
    const issueDataGCcode = {
    title: `${formValue.requestType}: Request access to ${formValue.ewsServices}`,
    confidential: "true",
    labels: `New, ${formValue.requestType}, ${formValue.ewsServices} `,
    description: `${formValue.appDesc}
  
  | Application Info | |
  | ------ | ------ |
  | **Application Environment** | ${formValue.requestType} |
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
  
  /**
    This function creates a new issue in GCcode using the GitLab API, and return await response.json()
    @param formValue The web form data and format it into markdown tables
  */
  async createIssue(formValue) {
  
    const issueData = this.getIssueData(formValue);
  
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
  
    return this.convertResponseValues(responseData);
  }
  
  /** 
    This function returns common response values specific to GCcode
    @param responseData The GCcode api response values
  */
    convertResponseValues(responseData){
      const resultValues = {
        issueUrl: responseData.web_url
        //TODO: add issue ID for Modify existing issue
      };
  
      return resultValues;
    }
}
