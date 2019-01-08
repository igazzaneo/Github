var database = null;

var nextUser = 101;

var rowCount = 0;

function initDatabase() {

  database = sqlitePlugin.openDatabase({name: 'tusciasegreta.db', location: 'default'});

  database.transaction(function(transaction) {
    transaction.executeSql('CREATE TABLE utente (name, email, password, logged)');
    showMessage("Db initialized");
  });
}

function logOut() {

  database.transaction(function(transaction) {
    transaction.executeSql('delete from utente');
  }, function(error) {
    showMessage('DELETE error: ' + error.message);
  }, function() {
    showMessage('DELETE OK');
  });

}

//function logIn(username, password) {
function logIn() {

  var login='igazzaneo@gmail.com';
  var password='password';

  database.transaction(function(transaction) {

    var query = "SELECT * FROM utente WHERE email = ? and password = ?";

    transaction.executeSql(query, [login, password], function (transaction, resultSet) {
      var trovato = resultSet.rows.length;

      if(trovato > 0) {

        saveOnLocalStorage();

        // Utente presente e credenziali ok
        showMessage("Benvenuto: " + resultSet.rows.item(0).name + " - " + resultSet.rows.item[0].email);

        // Aggiorno il campo logged
        database.transaction(function(transaction) {
          transaction.executeSql('update utente set logged=1');
        }, function(error) {
          showMessage('UPDATE error: ' + error.message);
        }, function() {
          showMessage('UPDATE OK');
        });

      } else {
        showMessage('Nessun utente trovato!!!');
      }

    },
    function (tx, error) {
        console.log('SELECT error: ' + error.message);
    });

  }, function(error) {
    showMessage('LOGIN error: ' + error.message);
  }, function() {
    //showMessage('LOGIN OK');
  });

}

function showCount() {
  database.transaction(function(transaction) {
    transaction.executeSql('SELECT count(*) AS recordCount FROM utente where logged=1', [], function(ignored, resultSet) {
      showMessage('RECORD COUNT: ' + resultSet.rows.item(0).recordCount);
    });
  }, function(error) {
    showMessage('SELECT count error: ' + error.message);
  });
}

function getRowCount() {

  database.transaction(function(transaction, rowCount) {
    transaction.executeSql('SELECT count(*) AS recordCount FROM utente where logged=1', [], function(ignored, resultSet) {
      rowCount = resultSet.rows.item(0).recordCount;

      showMessage("RowCount: " + rowCount);
      return rowCount;
    });
  }, function(error, rowCount) {
    rowCount = 0;
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
    transaction.executeSql('INSERT INTO utente VALUES (?,?, ?, ?)', ['italo', 'igazzaneo@gmail.com', 'password', 0]);
  }, function(error) {
    showMessage('INSERT error: ' + error.message);
  }, function() {
    showMessage('INSERT OK');
    ++nextUser;
  });
}



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

function getValueFromLocalStorage(key) {

  if(window.localStorage.getItem(key) == null)
    return 0
  else
    return window.localStorage.getItem(key);

}

function saveOnLocalStorage() {
  window.localStorage.setItem("loggedUser", "1");
}

function checkUser() {

  var logged = getValueFromLocalStorage("loggedUser");

  showMessage("Logged:" + logged);

  if(logged == 1) {
    goToPage2();
  } else {
    showMessage('Utente non loggato');
  }

  //var recordCount = getRowCount();

  /*if(getRowCount() == 0) {
    showMessage('Utente non loggato');
  } else {
    goToPage2();
  }*/
}

document.addEventListener('deviceready', function() {
  $('#add-record').click(addRecord);
  $('#show-count').click(showCount);
  $('#checkuser').click(checkUser);
  $('#login').click(logIn);
  $('#logout').click(logOut);
  //$('#openEmail').click(openEmail);

  initDatabase();

});
