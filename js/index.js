function toggleSignIn() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (email.length < 1) {
      alert('Please enter a valid email address.');
      return;
    }
    if (password.length < 1) {
      alert('Please enter a valid password.');
      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(user) {
        document.location.href = '../library.html';
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }
}

function handleSignUp() {
  var email = document.getElementById('signupemail').value;
  var password = document.getElementById('signuppassword').value;
  var confirm = document.getElementById('signupconfirm').value;

  if (email.length < 1) {
    alert('Please enter a valid email address.');
    return;
  }
  if (password.length < 1) {
    alert('Please enter a valid password.');
    return;
  }
  if (password !== confirm) {
    alert('Passwords do not match.');
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  });
}

function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var displayName = user.displayName;
      var email = user.email;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var providerData = user.providerData;
    }
  });
  document.getElementById('signin').addEventListener('click', toggleSignIn);
  document.getElementById('signup').addEventListener('click', handleSignUp);
}

window.onload = function() {
  initApp();
};
