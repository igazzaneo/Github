var rowCount = 0;
var database = null;
var databaseUtente = null;

var elencoSiti = new Array();

function initDatabase() {

  window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "/copied_tusciasegreta.db", openDb, setupDB);

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
      showMessage("Database già presente");
    }).catch(function () {
      //showMessage("file doesn't exist, copying it");
      return new Promise(function (resolve, reject) {
        sourceFile.copyTo(targetDir, 'copied_' + dbName, resolve, reject);
      }).then(function () {
        showMessage("Database copiato");
      });
    });
  });
}
// copy DB and open it
function setupDB() {
    showMessage("onSetupDB()");
    copyDatabaseFile('tusciasegreta.db').then(function () {
      database = sqlitePlugin.openDatabase({name: 'copied_tusciasegreta.db'});
    }).catch(function (err) {
      // error! :(
      showMessage(err);
    });

}

// db already in dir, this function only open it
function openDb() {
  showMessage("onOpenDb()");
  database = sqlitePlugin.openDatabase({name: 'copied_tusciasegreta.db'});

  /*database.transaction(function(transaction) {
    transaction.executeSql('SELECT * FROM sito', [], function(ignored, resultSet) {
      showMessage('Denominazione: ' + resultSet.rows.item(0).denominazione + ' - Video: ' + resultSet.rows.item(0).video + ' - Coordinate: ' + resultSet.rows.item(0).latitudine + " - " + + resultSet.rows.item(0).longitudine);
    });
  }, function(error) {
    showMessage('SELECT error: ' + error.message);
  });*/
}

function registrazioneDaApp() {

  var form = $("#registrazioneForm");
	$("#submitButton",form).attr("disabled","disabled");

  var email       = $("#email", form).val();
  var nome_utente = $("#username", form).val();
  var cellulare   = $("#cellulare", form).val();
  var password    = $("#password", form).val();

  if(email != "" && nome_utente != "" && password != '' && cellulare != '')
    registraUtente(nome_utente, email, password, cellulare);
  else {
    showMessage("Tutti i campi sono obbligatori");
    $("#submitButton").removeAttr("disabled");
  }

  return false;

}

function registraUtente(nome_utente, email, password, cellulare) {

  // Effettuo la cancellazione preventiva dei record per evitare di avere più di un utente nel DB locale
  database.transaction(function(transaction) {
    transaction.executeSql('DELETE FROM utente', []);
    transaction.executeSql('INSERT INTO utente VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [1, nome_utente, 'Gazzaneo', 'Italo', email, password, '', cellulare, '']);
    transaction.executeSql('select count(*) as recordCount from utente', [], function(ignored, resultSet) {
     showMessage("Utenti trovati: " + resultSet.rows.item[0].recordCount)
   });

  }, function(error) {
    showMessage('Errore nella cancellazione: ' + error.message);
  }, function() {
    showMessage('Inserimento avvenuto correttamente.');
    fn.gotoPage('accesso.html');
  });

}

function logOut() {

  removeFromLocalStorage("loggedUser");

  if(getValueFromLocalStorage('loggedUser') == 0) {
    showMessage('Logout avvenuto con successo');
    fn.gotoPage('accesso.html');
  }

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

function accessoDaApp() {

  var form = $("#loginForm");
	$("#submitButton",form).attr("disabled","disabled");

	var username = $("#username", form).val();
	var password = $("#password", form).val();

  //showMessage(username + " - " + password);

  if(username != "" && password != "")
    logIn(username, password);
  else if(username == "") {
    showMessage("Nome utente obbligatorio");
    $("#submitButton").removeAttr("disabled");
  } else if(password == "") {
    showMessage("Password obbligatoria");
    $("#submitButton").removeAttr("disabled");
  }

  return false;
}


function logIn(login, password) {

  database.transaction(function(transaction) {

    var query = "SELECT * FROM utente WHERE nome_utente = ? and password = ?";

    transaction.executeSql(query, [login, password], function (transaction, resultSet) {

      var trovato = resultSet.rows.length;

      if(trovato > 0) {

        // Utente presente e credenziali ok
        showMessage("Benvenuto: " + resultSet.rows.item[0].nome_utente + " - " + resultSet.rows.item[0].email + " - " + resultSet.rows.item[0].password + " - " + resultSet.rows.item[0].cellulare);

        saveOnLocalStorage("loggedUser", "1");
        showMessage('Login avvenuto con successo');
        fn.gotoPage("accesso_effettuato.html");

      } else {
        showMessage('Nessun utente trovato!!!');
      }

    },
    function (tx, error) {
        showMessage('Accesso non consentito: ' + error.message);
    });

  }, function(error) {
    showMessage('LOGIN error: ' + error.message);
  }, function() {

  });

}

function showMessage(message) {
  console.log(message);
  if (window.cordova.platformId === 'osx')
    window.alert(message);
  else
    navigator.notification.alert(message);
}

function checkUser() {

  var logged = getValueFromLocalStorage("loggedUser");

  if(logged == 1) {
    fn.load('accesso_effettuato.html')
  } else {
    //showMessage('Utente non loggato');
  }

}

function getElencoSiti() {

  showMessage("onGetElencoSiti()");
  var elenco = Array();

  database.transaction(function(transaction) {
    transaction.executeSql('SELECT * FROM sito', [], function(ignored, resultSet) {
      showMessage('Denominazione: ' + resultSet.rows.item(0).denominazione + ' - Video: ' + resultSet.rows.item(0).video + ' - Coordinate: ' + resultSet.rows.item(0).latitudine + " - " + + resultSet.rows.item(0).longitudine);
    });
  }, function(error) {
    showMessage('SELECT error: ' + error.message);
  });

  //return elenco;
}

document.addEventListener('deviceready', function() {

  initDatabase();
  //elencoSiti = getElencoSiti();
  getElencoSiti();

});
