// Toggles password modal to change password
function passwordModal() {
  document.getElementById('pwModal').style.display = 'block';

  document.getElementById('passwordconfirm').addEventListener('click', function() {
    var user = firebase.auth().currentUser;
    var newPassword = document.getElementById('newpassword').value;
    var confirmPassword = document.getElementById('confirmpassword').value;

    if (newPassword == confirmPassword) {
      user.updatePassword(newPassword).then(function() {
        document.location.href = '../account.html';
      });
    } else {
      alert('Passwords do not match.');
      return;
    }
  });

  document.getElementById('passwordcancel').addEventListener('click', function() {
    document.getElementById('pwModal').style.display = 'none';
  });
}

// Sends user back to login at signout
function handleSignOut() {
  firebase.auth().signOut().then(function() {
    document.location.href = '../index.html';
  });
}

// Initialize app
function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var displayName = user.displayName;
      var email = user.email;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var providerData = user.providerData;
    } else {
      document.location.href = '../index.html';
    }
  });
  document.getElementById('changePass').addEventListener('click', passwordModal);
  document.getElementById('logout').addEventListener('click', handleSignOut);
}

window.onload = function() {
  initApp();
};
