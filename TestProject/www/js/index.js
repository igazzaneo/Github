
var app = {
  // Application Constructor
  initialize: function () {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function () {
    app.receivedEvent('deviceready');

    myDB = sqlitePlugin.openDatabase({name: 'mydb.db', location: 'default' }, function (db) {}, function (error) { console.log('Open database ERROR: ' + JSON.stringify(error)); });
    alert('DB: SQLite');
    alert("Opened!!!");

  },
  // Update DOM on a Received Event
  receivedEvent: function (id) {
    console.log('Received Event: ' + id);
  }
};

app.initialize();

//Create new table
$("#createTable").click(function(){
    alert("Clicked!!!!.");
    onDeviceReady();
    myDB.transaction(function(transaction) {
    transaction.executeSql('CREATE TABLE IF NOT EXISTS phonegap_pro (id integer primary key, title text, desc text)', [],
        function(tx, result) {
            alert("Table created successfully");
        },
        function(error) {
              alert("Error occurred while creating the table.");
        });
    });
});

//Insert New Data
$("#insert").click(function(){
  var title=$("#title").val();
  var desc=$("#desc").val();
  console.log(title +""+ desc);
  myDB.transaction(function(transaction) {
        var executeQuery = "INSERT INTO phonegap_pro (title, desc) VALUES (?,?)";
        transaction.executeSql(executeQuery, [title,desc]
            , function(tx, result) {
                 alert('Inserted');
            },
            function(error){
                 alert('Error occurred');
            });
    });
});

//Display Table Data
$("#showTable").click(function(){
  $("#TableData").html("");
  myDB.transaction(function(transaction) {
  transaction.executeSql('SELECT * FROM phonegap_pro', [], function (tx, results) {
       var len = results.rows.length, i;
       $("#rowCount").html(len);
       for (i = 0; i < len; i++){
          $("#TableData").append("<tr><td>"+results.rows.item(i).id+"</td><td>"+results.rows.item(i).title+"</td><td>"+results.rows.item(i).desc+"</td><td><a href='edit.html?id="+results.rows.item(i).id+"&title="+results.rows.item(i).title+"&desc="+results.rows.item(i).desc+"'>Edit</a> &nbsp;&nbsp; <a class='delete' href='#' id='"+results.rows.item(i).id+"'>Delete</a></td></tr>");
       }
    }, null);
  });
});
