var uri = "http://localhost:3030"; // local testing
// var uri = "http://159.65.76.75:8080"; // Digital Ocean depoloyment

// fetches and displays learning models
function readLM(){
  console.log("Retrieving list: ");
  $.getJSON(uri + "/api/review", (data)=>{  // grabs JSON from endpoint
    console.log(data);
    $('#LMDisplay').val(JSON.stringify(data));  // passes JSON to text area
  })
  .fail((err)=>{
    console.log("Error in retrieving list data.");
  });
}

// generates single entry via API endpoint
function createLM(){
  // grabs model data from text areas
  let LMTitle = $('#LMTitle').val();
  let LMDescription = $('#LMDescription').val();
  let learningModel = {        // creates JSON object from various text entries
    "title": LMTitle,
    "description": LMDescription
  };
  console.log("Creating learning model: ");
  console.log(learningModel);

  //  makes API call to post new JSON object to endpoint
  $.ajax({
    // parameters for posted object
    contentType: "application/json",
    url: uri + "/api/review/",
    type: "post",
    data: JSON.stringify(learningModel),
    dataType: "json"
  })
  .done((data) => {
      console.log("displaoying new learning model: " + data);
      $('#LMDisplay').val(JSON.stringify(data));
  }).fail((err) => {
    console.log("Failed to create: " + err);
  });
}

// updates learning model to API endpoint based upon inputted ID
function updateLM(){
  // assigns ID based upon text area submission
  let LearningModelID = $('#LMID').val();
  console.log("Updating LM ID " + LearningModelID);

  // grabs model data from text areas
  let LMDescription = $('#LMDescription').val();
  let LMTitle = $('#LMTitle').val();
  let LearningModel = {        // creates JSON object from various text entries
    "title": LMTitle,
    "description": LMDescription
  };
  console.log("Upadting learning model: ");
  console.log(LearningModel);

  //  makes API call to post new JSON object to endpoint
  $.ajax({
    // parameters for putted object
    contentType: "application/json",
    url: uri + "/api/review/" + LearningModelID,
    type: "put",
    data: JSON.stringify(LearningModel),
    dataType: "json"
  })
  .done((data) => {
      console.log("displaoying new learning model: " + data);
      $('#LMDisplay').val(JSON.stringify(data));
  }).fail((err) => {
    console.log("Failed to create: " + err);
  });
}

function deleteLM(){
  let learningModelID = $('#deleteID').val();
  console.log("Deleting LM ID " + learningModelID);

  $.ajax({
    url: uri + "/api/review/" + learningModelID,
    type: "delete",
    dataType: "json"
  }).done((data) => {
    console.log("Displaying deleted learning model: " + data);
    $('#LMDisplay').val(JSON.stringify(data));
  }).fail((err) => {
    console.log("Failed to delete: " + err);
  });
}

//initialize buttons and text when page loads
$(document).ready(function(){
  //event handlers for four CRUD operations
  $('#createBtn').on('click', createLM);
  $('#readBtn').on('click', readLM);
  $('#updateBtn').on('click', updateLM);
  $('#deleteBtn').on('click', deleteLM);

  //ovrride that prevents form submission, and therefore any side-effects
  $('#LMForm').on('submit', function(){
    return false;
  });
});
