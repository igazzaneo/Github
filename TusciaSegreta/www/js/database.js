
var rowCount = 0;

function initDatabase() {

  database = sqlitePlugin.openDatabase({name: 'tusciasegreta.db', location: 'default'});

  database.transaction(function(transaction) {
    transaction.executeSql('CREATE TABLE utente (id, nome_utente, email, password, cellulare, cittadinanza, lingua, cognome, nome)');
  });
}

function registrazioneDaApp() {

  var email = $("#email").val();
  var nome_utente = $("#username").val();
  var cellulare = $("#cellulare").val();
  var password = $("#password").val();

  showMessage(email + " - " + nome_utente + " - " + cellulare + " - " + password);

  registraUtente(nome_utente, email, password, cellulare)
}

function registraUtente(nome_utente, email, password, cellulare) {

  // Effettuo la cancellazione preventiva dei record per evitare di avere più di un utente nel DB locale
  database.transaction(function(transaction) {
    transaction.executeSql('DELETE FROM utente', []);
  }, function(error) {
    //showMessage('Errore nella registrazione: ' + error.message);
  }, function() {
    //showMessage('Inserimento avvenuto correttamente.');
  });

  database.transaction(function(transaction) {
    transaction.executeSql('INSERT INTO utente VALUES (?, ?, ?, ?, ?)', [1, nome_utente, email, password, cellulare]);
  }, function(error) {
    showMessage('Errore nella registrazione: ' + error.message);
  }, function() {
    showMessage('Inserimento avvenuto correttamente.');
  });
}

function logOut() {

  removeFromLocalStorage("loggedUser");

  if(getValueFromLocalStorage('loggedUser') == 0)
    showMessage('Logout avvenuto con successo');

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

  var username = $("#username").val();
  var password = $("#password").val();

  showMessage(username + " - " + password);

  if(username != "" && password != "")
    logIn(username, password);
  else if(username == "") {
    showMessage("Nome utente obbligatorio");
  } else if(password == "") {
    showMessage("Password obbligatoria");
  }
}

function logIn(login, password) {

  database.transaction(function(transaction) {

    var query = "SELECT * FROM utente WHERE nome_utente = ? and password = ?";

    transaction.executeSql(query, [login, password], function (transaction, resultSet) {

      var trovato = resultSet.rows.length;

      if(trovato > 0) {

        // Utente presente e credenziali ok
        showMessage("Benvenuto: " + resultSet.rows.item[0].nome_utente + " - " + resultSet.rows.item[0].email + " - " + resultSet.rows.item[0].password + " - " + resultSet.rows.item[0].cellulare);

        // Aggiorno il campo logged
        /*database.transaction(function(transaction) {
          transaction.executeSql('update utente set logged=1');
        }, function(error) {
          showMessage('UPDATE error: ' + error.message);
        }, function() {
          showMessage('UPDATE OK');
        });*/

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
    saveOnLocalStorage("loggedUser", "1");
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
    showMessage('Utente non loggato');
  }

}

document.addEventListener('deviceready', function() {

  initDatabase();

});
