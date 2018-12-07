var itemList = [];

function updateLibrary() {
  document.getElementById('library').innerHTML = '';
  console.log("Updating Library");
  itemList = [];
  var count = 0;

  var user = firebase.auth().currentUser;
  var dbRef = firebase.database().ref('users/' + user.uid + '/memes');
  var thisRef = dbRef.once('value').then((snapshot) =>{
    snapshot.forEach((child) => {
        itemList.push(child.val());

        var meme = document.createElement("div");
        meme.id = 'meme' + count;
        meme.className = 'meme';
        document.getElementById("library").appendChild(meme);

        var image = document.createElement("img");
        image.className = 'image';
        image.src = child.val();
        document.getElementById("meme" + count).appendChild(image);

        var brk = document.createElement("br");
        document.getElementById("meme" + count).appendChild(brk);

        var but1 = document.createElement("div");
        but1.className = "botbutton";
        var edit = document.createElement("button");
        edit.type = "button";
        edit.innerHTML = "Edit";
        but1.appendChild(edit);
        document.getElementById("meme" + count).appendChild(but1);

        var but2 = document.createElement("div");
        but2.className = "botbutton";
        var del = document.createElement("button");
        del.type = "button";
        del.innerHTML = "Delete";
        del.setAttribute("memeid", child.key);
        del.addEventListener("click", deleteMeme);

        but2.appendChild(del);
        document.getElementById("meme" + count).appendChild(but2);

        var but3 = document.createElement("div");
        but3.className = "botbutton";
        var share = document.createElement("button");
        share.type = "button";
        share.innerHTML = "Share";
        but3.appendChild(share);
        document.getElementById("meme" + count).appendChild(but3);

        var dl = document.createElement("a");
        dl.innerHTML = "Download";
        dl.href = child.val();
        dl.className = "dllink";
        document.getElementById("meme" + count).appendChild(dl);

        count += 1;
        return false;
    })
    if (itemList.length > 0) {
      document.getElementById("empty").style.display = "none";
    }
    return itemList;
  });
}

function deleteMeme(e) {
    var user = firebase.auth().currentUser;
    var dbRef = firebase.database().ref('users/' + user.uid + '/memes');
		e.stopPropagation();
		var memeID = e.target.getAttribute("memeid");
		dbRef.child(memeID).remove();
    updateLibrary();
}

function createMeme() {
  document.getElementById('cuModal').style.display = 'block';

  var prev = document.getElementById('preview');

  setInterval(function() {
    prev.src = '../templates/' + document.getElementById('template').value + '.jpg';
  }, 0)

  document.getElementById('cuconfirm').addEventListener('click', function () {
    document.getElementById('cuModal').style.display = 'none';
    var file = document.getElementById('upload3').files[0];
    if (file) {
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
        console.log("Adding Your Meme");
        return url;
      })
      .then(updateLibrary);
    } else {
      //Not sure how to read from local file for templates if user
      //didn't upload anything

      /*file = '../templates/' + document.getElementById('template').value + '.jpg';
      console.log(file);

      var user = firebase.auth().currentUser;
      var storageRef = firebase.storage().ref('user/' + user.uid);
      console.log("TEST " + user);
      var thisRef = storageRef.child(document.getElementById('template').value + '.jpg');
      thisRef.put(file).then(function(snapshot) {
        return snapshot.ref.getDownloadURL();
      })
      .then(function(url) {
        console.log(`Successfully uploaded file and got download link - ${url}`);
        database.ref('users/' + user.uid + '/memes').push(url);

        return url;
      });*/
    }
    document.getElementById("upload3").value = "";
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

      updateLibrary();
    } else {
      document.location.href = '../index.html';
    }
  });

  document.getElementById('create').addEventListener('click', createMeme);
}

window.onload = function() {
  initApp();
};
