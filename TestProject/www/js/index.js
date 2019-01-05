
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
