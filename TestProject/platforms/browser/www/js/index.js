var database = null;

var nextUser = 101;

var rowCount = 0;

var siti = [];

function initDatabase() {
  showMessage("Check DB on storage...");
  window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "/copied_tusciasegreta.db", selectDataFromDB, setupDB);

}

// Success method
function selectDataFromDB() {

  database = sqlitePlugin.openDatabase({name: "copied_tusciasegreta.db"});

  database.transaction(function(transaction) {
    transaction.executeSql('SELECT * FROM sito', [], function(ignored, resultSet) {
      showMessage('Denominazione: ' + resultSet.rows.item(0).denominazione + ' - Video: ' + resultSet.rows.item(0).video + ' - Coordinate: ' + resultSet.rows.item(0).latitudine + " - " + + resultSet.rows.item(0).longitudine);
    });
  }, function(error) {
    showMessage('SELECT error: ' + error.message);
  });
}

// Fail Method
function setupDB() {

  /*database = sqlitePlugin.openDatabase({name: 'tusciasegreta.db', location: 'default'});

  database.transaction(function(transaction) {
      transaction.executeSql('CREATE TABLE sito (id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, denominazione	TEXT NOT NULL, descrizione TEXT NOT NULL, video	TEXT, latitudine	NUMERIC NOT NULL, longitudine	NUMERIC NOT NULL)');
    });
  }*/

    copyDatabaseFile('tusciasegreta.db').then(function () {
    // success! :)
    showMessage("DB copiato e aperto!!");
    database = sqlitePlugin.openDatabase({name: 'copied_tusciasegreta.db', location: 'default'});

    database.transaction(function(transaction) {
      transaction.executeSql('SELECT * FROM sito', [], function(ignored, resultSet) {
        showMessage('Denominazione: ' + resultSet.rows.item(0).denominazione + ' - Video: ' + resultSet.rows.item(0).video + ' - Coordinate: ' + resultSet.rows.item(0).latitudine + " - " + + resultSet.rows.item(0).longitudine);
      });
    }, function(error) {
      showMessage('SELECT error: ' + error.message);
    });

  }).catch(function (err) {
    // error! :(
    showMessage(err);
  });

}

// copy a database file from www/ in the app directory to the data directory
function copyDatabaseFile(dbName) {
  var sourceFileName = cordova.file.applicationDirectory + 'www/' + dbName;
  var targetDirName = cordova.file.dataDirectory;
  return Promise.all([
    new Promise(function (resolve, reject) {
      resolveLocalFileSystemURL(sourceFileName, resolve, reject);
    }),
    new Promise(function (resolve, reject) {
      resolveLocalFileSystemURL(targetDirName, resolve, reject);
    })
  ]).then(function (files) {
    var sourceFile = files[0];
    var targetDir = files[1];
    return new Promise(function (resolve, reject) {
      targetDir.getFile(dbName, {}, resolve, reject);
    }).then(function () {
      showMessage("file already copied");
    }).catch(function () {
      showMessage("file doesn't exist, copying it");
      return new Promise(function (resolve, reject) {
        sourceFile.copyTo(targetDir, 'copied_' + dbName, resolve, reject);
      }).then(function () {
        showMessage("database file copied");
      });
    });
  });
}


function logOut() {

  database.transaction(function(transaction) {
    transaction.executeSql('delete from utente');
  }, function(error) {
    showMessage('DELETE error: ' + error.message);
  }, function() {
    showMessage('DELETE OK');
    removeFromLocalStorage("loggedUser");
  });

}




//function logIn(username, password) {
function logIn(login, password) {

  //var login='igazzaneo@gmail.com';
  //var password='password';

  database.transaction(function(transaction) {

    var query = "SELECT * FROM utente WHERE email = ? and password = ?";

    showMessage(query);

    transaction.executeSql(query, [login, password], function (transaction, resultSet) {

      var trovato = resultSet.rows.length;
      showMessage(trovato);

      if(trovato > 0) {

        // Utente presente e credenziali ok
        showMessage("Benvenuto: " + resultSet.rows.item[0].name + " - " + resultSet.rows.item[0].email);

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
    saveOnLocalStorage("loggedUser", "1");
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
  console.log(window.cordova.platformId);

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

function saveOnLocalStorage(key, value) {
  window.localStorage.setItem(key, value);
}

function removeFromLocalStorage(key) {
  window.localStorage.removeItem(key);
}

function checkUser() {

  var logged = getValueFromLocalStorage("loggedUser");

  showMessage("Logged:" + logged);

  if(logged == 1) {
    goToPage2();
  } else {
    showMessage('Utente non loggato');
  }

}

function openEmail() {
  window.plugins.email.open({
      to:      'max@mustermann.de',
      cc:      'erika@mustermann.de',
      bcc:     ['john@doe.com', 'jane@doe.com'],
      subject: 'Greetings',
      body:    'How are you? Nice greetings from Leipzig'
  });

}

function openDB() {

  showMessage("openDB()");
  //var elenco = new Array();

  database.transaction(function(transaction) {
    transaction.executeSql('SELECT * FROM sito', [], function(ignored, resultSet) {
      showMessage('Denominazione: ' + resultSet.rows.item(0).denominazione + ' - Video: ' + resultSet.rows.item(0).video + ' - Coordinate: ' + resultSet.rows.item(0).latitudine + " - " + + resultSet.rows.item(0).longitudine);
    });
  }, function(error) {
    showMessage('SELECT error: ' + error.message);
  });

  //return elenco;
}

function getElencoSiti() {

  showMessage("onGetElencoSiti()");
  var elenco = new Array();
  siti = new Array();

  database.transaction(function(transaction) {
    transaction.executeSql('SELECT * FROM sito', [], function(ignored, resultSet) {

      for(var x = 0; x < resultSet.rows.length; x++) {

        var riga = new Array();
        riga[0] = resultSet.rows.item(x).id;
        riga[1] = resultSet.rows.item(x).denominazione;
        riga[2] = resultSet.rows.item(x).descrizione;
        riga[3] = resultSet.rows.item(x).video;
        riga[4] = resultSet.rows.item(x).latitudine;
        riga[5] = resultSet.rows.item(x).longitudine;

        showMessage('Denominazione: ' + riga[1] + ' - Video: ' + riga[3] + ' - Coordinate: ' + riga[4] + " - " + riga[5]);

        elenco[x] = riga;
      }
      showMessage("Setting siti = elenco...")
      siti = elenco;
    });
  }, function(error) {
    showMessage('SELECT error: ' + error.message);
  }, function() {
    showMessage("Transazione ok");
  });

  //return elenco;
}

document.addEventListener('deviceready', function() {

  $('#add-record').click(addRecord);
  $('#show-count').click(showCount);
  $('#checkuser').click(checkUser);
  $('#login').click(logIn);
  $('#logout').click(logOut);
  $('#openDB').click(openDB);
  $('#openEmail').click(getElencoSiti);

  initDatabase();
  getElencoSiti();
  showMessage("Siti trovati: " + siti.length);


});
