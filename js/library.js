var itemList = [];

function lib() {
  itemList = [];

  var user = firebase.auth().currentUser;
  var dbRef = firebase.database().ref('users/' + user.uid + '/memes');
  var thisRef = dbRef.once('value').then((snapshot) =>{
    snapshot.forEach((child) => {
        itemList.push(child.val());
        var node = document.createElement("p");                 // Create a <li> node
        var textnode = document.createTextNode("TEST");         // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>
        document.getElementById("emptylibrary").appendChild(node);     // Append <li> to <ul> with id="myList"
        return false;
    })
    return itemList;
  });
}

document.getElementById('test').addEventListener('click', lib);

function createMeme() {
  document.getElementById('cuModal').style.display = 'block';

  var prev = document.getElementById('preview');

  setInterval(function() {
    prev.src = '../templates/' + document.getElementById('template').value + '.jpg';
  }, 0)

  document.getElementById('cuconfirm').addEventListener('click', function () {
    document.getElementById('cuModal').style.display = 'none';

    var file = document.getElementById('upload3').files[0];
    console.log(file);

    var user = firebase.auth().currentUser;
    var storageRef = firebase.storage().ref('user/' + user.uid);
    console.log("TEST " + user);
    var thisRef = storageRef.child(file.name);
    thisRef.put(file).then(function(snapshot) {
      return snapshot.ref.getDownloadURL();
    })
    .then(function(url) {
      console.log(`Successfully uploaded file and got download link - ${url}`);
      database.ref('users/' + user.uid + '/memes').push(url);

      return url;
    });
  });
  document.getElementById('cucancel').addEventListener('click', function () {
    document.getElementById('cuModal').style.display = 'none';
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
    } else {
      document.location.href = '../index.html';
    }
  });
}

document.getElementById('create').addEventListener('click', createMeme);

window.onload = function() {
  initApp();
};
