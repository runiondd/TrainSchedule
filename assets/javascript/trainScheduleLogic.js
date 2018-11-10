
var config = {
    apiKey: "AIzaSyBTSvYqFGkwiN3NC7FjXBqj4Db3ScTmzeQ",
    authDomain: "train-schedule-abb81.firebaseapp.com",
    databaseURL: "https://train-schedule-abb81.firebaseio.com",
    projectId: "train-schedule-abb81",
    storageBucket: "train-schedule-abb81.appspot.com",
    messagingSenderId: "395768180160"
  };

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
    console.log("I am here"); 
    event.preventDefault();

  // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    
  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    dest: trainDest,
    first: firstTrain,
    freq: frequency
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
//   console.log(newTrain.name);
//   console.log(newTrain.dest);
//   console.log(newTrain.first);
//   console.log(newTrain.freq);

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().dest;
    var firstTrain = moment(childSnapshot.val().first, "HH:mm");
    //console.log("childSnapshot.val().first= " + childSnapshot.val().first);
    var frequency = childSnapshot.val().freq;
   // var nextTrain = firstTrain.add(15, "minutes");

// Pat's suggestion
    var nextTrain = moment(firstTrain).add(frequency, "minutes");
    console.log("firstTrain=" + firstTrain.format("HH:mm")) 
    console.log("nextTrain=" + nextTrain.format("HH:mm")) 

    var blnAddTime = true;
    while (nextTrain < moment()) {
        nextTrain = moment(nextTrain).add(frequency, "minutes");
    }    

    //firstTrain comes in at 6:00am
    //it arrives at the station every 10 minutes (frequency)
    //ex. 6:10, 6:20, 6:30;
    //if it is 7:02 am, then next arrival is 8 minutes away and next arrival is 7:10
    //how do we calculate the next arrival?
    //6:10, 6:20 6:50, 7:00, 7:10 //take first time, keep adding the frequency, until the time is greater than the current time....THAT time is the next arrival time
    //how do we calculate how many minutes away?  //minutes away is next arrival minus "now"
    // console.log("next train:" + moment.unix(nextTrain).format("HH:mm"));
    var now = moment();
    var duration = moment.duration(nextTrain.diff(now));
    console.log("duration=" + duration);
        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDest),
            $("<td>").text(frequency),
              $("<td>").text(nextTrain.format("HH:mm")),
            $("<td>").text(duration.get("minutes")),
        );

        // Append the new row to the table
        $("#schedule-table > tbody").append(newRow);
    
});

function updateStartTime(){


}