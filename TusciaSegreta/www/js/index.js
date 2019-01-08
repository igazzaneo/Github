
/*var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var db = db = window.sqlitePlugin.openDatabase({
          name: 'my.db',
          location: 'default',
        });
alert("Device ready!!!")
        db.transaction(function(tx) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, score)');
          tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]);
          tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
        }, function(error) {
          console.log('Transaction ERROR: ' + error.message);
        }, function() {
          console.log('Populated database OK');
        });
    });
};*/

$(document).ready(function() {
    console.log( "ready!" );

    var db = window.sqlitePlugin.openDatabase({
      name: 'my.db',
      location: 'default',
    });

    db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, score)');
      tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]);
      tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
    }, function(error) {
      console.log('Transaction ERROR: ' + error.message);
    }, function() {
      console.log('Populated database OK');
    });
});
