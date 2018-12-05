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
}

window.onload = function() {
  initApp();
};
