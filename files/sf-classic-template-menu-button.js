//  This JS button was created by Chris Merrill whos our resident Adobe Sign + SalesForce Guru
//  This button will query for all agreement templates and
//  present a list for the user to choose an agreement template from.
//  If there is only 1 template, no options are given and that agreement template is used.
//  If there are no agreement templates, an alert is displayed.

// Id of MasterObjectType. Taken from URL
var MasterObjectId = document.URL.split("/")[3];

// Try to determine ObjectType by Id Prefix
// Master Object to be used with the agreement template
// Prefix to standard object mapping definitions: http://j.mp/1BY2cYY
//
var MasterObjectType;
switch (MasterObjectId.substring(0, 3)) {
  case '001':
    MasterObjectType = 'Account';
    break;
  case '003':
    MasterObjectType = 'Contact';
    break;
  case '005':
    MasterObjectType = 'User';
    break;
  case '006':
    MasterObjectType = 'Opportunity';
    break;
  case '800':
    MasterObjectType = 'Contract';
    break;
  case '500':
    MasterObjectType = 'Case';
    break;
  case '00Q':
    MasterObjectType = 'Lead';
    break;

    // If you are using a custom object, or one not listed above,
    // Change the default below
  default:
    MasterObjectType = "Opportunity";
} //</switch

// Salesforce.com Javascript libraries
{
  !REQUIRESCRIPT("/soap/ajax/31.0/connection.js")
} {
  !REQUIRESCRIPT("/soap/ajax/31.0/apex.js")
}

// Find Agreement templates related to MasterObjectType
// Change the query as needed to add additional filters for the agreement templates
var agreements = sforce.connection.query("SELECT Id, Name FROM echosign_dev1__Agreement_Template__c WHERE echosign_dev1__Master_Object_Type__c = '" + MasterObjectType + "'");

// Get array of related Agreement Templates
records = agreements.getArray("records");

// If there are zero templates, alert user and do nothing
if (records.length == 0) {

  alert('There are no agreement templates to choose from.');

  // If there is ONE template, there is no need to choose one. Navigate user forward
} else if (records.length == 1) {

  location.href = '/apex/echosign_dev1__AgreementTemplateProcess?masterId=' + MasterObjectId + '&TemplateId=' + records[0].Id;

  // If there are more than one, Let the user choose which template to user
} else {


  // Declare HTML string for popup
  var agreementListHtml = '<br />';

  // Build HTML to show in modal.
  for (var i = 0; i < records.length; i++) {

    agreementListHtml += '   <h3><a href="/apex/echosign_dev1__AgreementTemplateProcess?masterId=' + MasterObjectId + '&TemplateId=' + records[i].Id + '" title="' + records[i].Id + '">' + records[i].Name + '</a></h3>';


    if (i < records.length) {

      agreementListHtml += '<br /><br />';

    } // </if

  } // </for

  // HTML for close button that is included at the bottom of the modal
  var closeButtonHtml = "<p style='text-align:right;'><button class='btn' onclick='window.parent.sd.hide(); return false;'> Close </button>   </p>";

  // Use salesforce.com native SimpleDialog() to show modal
  var sd = new SimpleDialog("Agreement Template Chooser" + Math.random(), false);
  sd.setTitle("Choose an Agreement Template");
  sd.createDialog();
  window.parent.sd = sd;
  sd.setContentInnerHTML(agreementListHtml + closeButtonHtml);
  sd.show();
}
