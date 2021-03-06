// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#signUpBtn");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveCharacter: function(newCharacter) {
    console.log(newCharacter);
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/characters",
      data: JSON.stringify(newCharacter)
    });
  },
  getCharacters: function() {
    return $.ajax({
      url: "/api/characters",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "/api/characters/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getCharacters().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var newCharacter = {
    player_name: $("#player_name").val().trim(),
    player_age: $("#player_age").val().trim(),
    player_race: $("#char_race").val().trim(),
    player_class: $("#char_class").val().trim()
  };

  if (!(newCharacter)) {
    alert("All fields are required!");
    return;
  }
  
  API.saveCharacter(newCharacter).then(function() {
    window.location.replace("/signedIn");
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$(".character-form").on("submit", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
