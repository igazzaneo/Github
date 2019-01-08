var database = null;

var nextUser = 101;

var rowCount = 0;

function initDatabase() {

  //showMessage("In initDatabase");
  database = sqlitePlugin.openDatabase({name: 'sample.db', location: 'default'});
  showMessage("DB created!!!!");

  database.transaction(function(transaction) {
    transaction.executeSql('CREATE TABLE SampleTable (name, score)');
    showMessage("Table created: " + rowCount);
  });
}


/*function echoTest() {
  sqlitePlugin.echoTest(function() {
    showMessage('Echo test OK');
  }, function(error) {
    showMessage('Echo test ERROR: ' + error.message);
  });
}*/

/*function selfTest() {
  sqlitePlugin.selfTest(function() {
    showMessage('Self test OK');
  }, function(error) {
    showMessage('Self test ERROR: ' + error.message);
  });
}*/

/*function reload() {
  location.reload();
}*/

/*function stringTest1() {
  showMessage("Click...per dio!!!");
  database.transaction(function(transaction) {
    transaction.executeSql("SELECT upper('Test string') AS upperText", [], function(ignored, resultSet) {
      showMessage('Got upperText result (ALL CAPS): ' + resultSet.rows.item(0).upperText);
    });
  }, function(error) {
    showMessage('SELECT count error: ' + error.message);
  });
}*/

/*function stringTest2() {
  database.transaction(function(transaction) {
    transaction.executeSql('SELECT upper(?) AS upperText', ['Test string'], function(ignored, resultSet) {
      showMessage('Got upperText result (ALL CAPS): ' + resultSet.rows.item(0).upperText);
    });
  }, function(error) {
    showMessage('SELECT count error: ' + error.message);
  });
}*/

function showCount() {
  database.transaction(function(transaction) {
    transaction.executeSql('SELECT count(*) AS recordCount FROM SampleTable', [], function(ignored, resultSet) {
      showMessage('RECORD COUNT: ' + resultSet.rows.item(0).recordCount);
    });
  }, function(error) {
    showMessage('SELECT count error: ' + error.message);
  });
}

function getRowCount() {


  database.transaction(function(transaction, rowCount) {
    transaction.executeSql('SELECT count(*) AS recordCount FROM SampleTable', [], function(ignored, resultSet) {
      rowCount = resultSet.rows.item(0).recordCount;
      return rowCount;
      //setRowCount(resultSet.rows.item(0).recordCount);
    });
  }, function(error, rowCount) {
    rowCount = 100;
    //setRowCount(100);
    showMessage('SELECT count error2: ' + error.message);
    return rowCount;
  });

  //return rowCount;
}

function setRowCount(value) {
  showMessage(value);
  rowCount=value;
  showMessage(rowCount);
}

function addRecord() {
  database.transaction(function(transaction) {
    transaction.executeSql('INSERT INTO SampleTable VALUES (?,?)', ['User '+nextUser, nextUser]);
  }, function(error) {
    showMessage('INSERT error: ' + error.message);
  }, function() {
    showMessage('INSERT OK');
    ++nextUser;
  });
}

/*function addJSONRecordsAfterDelay() {
  function getJSONObjectArray() {
    var COUNT = 100;
    var myArray = [];

    for (var i=0; i<COUNT; ++i) {
      myArray.push({name: 'User '+nextUser, score: nextUser});
      ++nextUser;
    }

    return myArray;
  }

  function getJSONAfterDelay() {
    var MY_DELAY = 150;

    var d = $.Deferred();

    setTimeout(function() {
      d.resolve(getJSONObjectArray());
    }, MY_DELAY);

    return $.when(d);
  }

  // NOTE: This is similar to the case when an application
  // fetches the data over AJAX to populate the database.
  // IMPORTANT: The application MUST get the data before
  // starting the transaction.
  getJSONAfterDelay().then(function(jsonObjectArray) {
    database.transaction(function(transaction) {
      $.each(jsonObjectArray, function(index, recordValue) {
        transaction.executeSql('INSERT INTO SampleTable VALUES (?,?)',
          [recordValue.name, recordValue.score]);
      });
    }, function(error) {
      showMessage('ADD records after delay ERROR');
    }, function() {
      showMessage('ADD 100 records after delay OK');
    });
  });
}*/

/*function deleteRecords() {
  database.transaction(function(transaction) {
    transaction.executeSql('DELETE FROM SampleTable');
  }, function(error) {
    showMessage('DELETE error: ' + error.message);
  }, function() {
    showMessage('DELETE OK');
    ++nextUser;
  });
}*/

/*function alertTest() {
  showMessage('Alert test message');
}*/

function goToPage2() {
  window.location = "page2.html";
}

function goToPage(page) {
  window.location = page;
}

function showMessage(message) {
  console.log(message);
  if (window.cordova.platformId === 'osx')
    window.alert(message);
  else
    navigator.notification.alert(message);
}

function checkUser() {

  var recordCount = getRowCount();

  if(recordCount == 0) {
    showMessage('Utente non loggato');
  } else if(recordCount=100) {
    goToPage("edit.html");
  } else {
    goToPage2();
  }
}

document.addEventListener('deviceready', function() {
  //$('#alert-test').click(alertTest);
  //$('#string-test-1').click(stringTest1);
  $('#add-record').click(addRecord);
  $('#show-count').click(showCount);
  $('#checkuser').click(checkUser);
  $('#openEmail').click(openEmail);
  /*$('#reload').click(reload);

  $('#string-test-2').click(stringTest2);
  $('#add-json-records-after-delay').click(addJSONRecordsAfterDelay);
  $('#delete-records').click(deleteRecords);
  $('#location-page2').click(goToPage2);*/

  //initDatabase();

});

function openEmail() {
  cordova.plugins.email.isAvailable(
        function (isAvailable) {
            alert("is email mobile available? " + (isAvailable ? "Yes" : "No"));
            if(isAvailable){
             window.plugin.email.open({
                 to:      'test@test.com',
                 subject: 'Greetings',
                 body:    'How are you? Nice greetings from Leipzig'
             }, callback, scope);
           }
        }
    );
}

function callback(){
    showMessage("callback function");
}

function scope(){
    showMessage("scope function");
}

window.fn = {};

  window.fn.gotoPage = function(page) {
    var content = document.getElementById('content');
    content.load(page);
  };
