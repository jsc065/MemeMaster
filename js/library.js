// Global Variable for Images
var itemList = [];

// Update Library
function updateLibrary() {
  document.getElementById('library').innerHTML = '';
  console.log("Updating Library");

  // Reset library everytime. Wastes resources, but it works?
  itemList = [];
  var count = 0;

  // Loop through each URL in database, and append images and buttons to HTML lbirary DIV
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
    // Show header depending on if images or no imagess
    if (itemList.length > 0) {
      document.getElementById("empty").style.display = "none";
    } else {
      document.getElementById("empty").style.display = "block";
    }
    return itemList;
  });
}

// Delete Memes
function deleteMeme(e) {
    var user = firebase.auth().currentUser;
    var dbRef = firebase.database().ref('users/' + user.uid + '/memes');
    var stRef = firebase.storage().ref('user/' + user.uid);
		e.stopPropagation();
		var memeID = e.target.getAttribute("memeid");
		dbRef.child(memeID).remove();
    // Unable to figure out how to delete from storage
    //stRef.child('test.jpg').delete();
    updateLibrary();
}

var tempmeme = 0;

// Create Meme
function createMeme() {
  document.getElementById('cuModal').style.display = 'block';

  // Set preview of meme
  var prev = document.getElementById('preview');

  // Disable input if uploaed image is already a meme
  setInterval(function() {
    if (document.getElementById('noedit').checked) {
      document.getElementById('title').disabled = true;
      document.getElementById('toptext').disabled = true;
      document.getElementById('bottomtext').disabled = true;
      document.getElementById('tags').disabled = true;
    }
    else if (document.getElementById('noedit').checked == false){
      document.getElementById('title').disabled = false;
      document.getElementById('toptext').disabled = false;
      document.getElementById('bottomtext').disabled = false;
      document.getElementById('tags').disabled = false;
    }
  }, 0)

  // Update Preview from file upload
  document.getElementById('upload3').addEventListener('change', function () {
    console.log("SELECT");
    var file = document.getElementById('upload3').files[0];
    var user = firebase.auth().currentUser;
    var storageRef = firebase.storage().ref('user/' + user.uid + '/previews');
    var thisRef = storageRef.child(file.name);
    thisRef.put(file).then(function(snapshot) {
      return snapshot.ref.getDownloadURL();
    })
    .then(function(url) {
      if(file) {
        prev.src = url;
      }
    });
  });

  // When confirm is pressed, upload / create meme.
  document.getElementById('cuconfirm').addEventListener('click', function () {
    document.getElementById('cuModal').style.display = 'none';
    var file = document.getElementById('upload3').files[0];
    // Upload meme only if file is already a complete meme (checkbox)
    if (file && document.getElementById('noedit').checked) {
      console.log(file);

      var user = firebase.auth().currentUser;
      var storageRef = firebase.storage().ref('user/' + user.uid);
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
    // Otherwise image is a background and must need meme text
    } else if (file){

      // Upload meme to storage in order to get file to edit
      console.log("FILE");
      var user = firebase.auth().currentUser;
      var storageRef = firebase.storage().ref('user/' + user.uid);
      var thisRef = storageRef.child(file.name);
      thisRef.put(file).then(function(snapshot) {
        return snapshot.ref.getDownloadURL();
      })
      .then(function(url) {
        console.log(`Successfully uploaded file and got download link - ${url}`);
        console.log("Adding Your Meme");
        return url;
      })
      .then(function(imgurl) {
        // Get image from storage and edit
        console.log(`Successfully uploaded file and got download link - ${imgurl}`);
        var test = document.createElement("canvas");
        test.id = "customMeme";
        test.width = 400;
        test.height = 250;
        document.getElementById('emptylibrary').appendChild(test);

        // Create canvas from image and add text
        var canvas = document.getElementById("customMeme");
        var ctx = canvas.getContext("2d");
        var imageObj = new Image();
        imageObj.onload = function(){
          ctx.drawImage(imageObj, 0, 0, 400, 250);
          ctx.font = "24px Impact";
          ctx.textAlign = "center";
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 4;
          ctx.strokeText(document.getElementById("toptext").value, canvas.width/2, 30);
          ctx.strokeText(document.getElementById("bottomtext").value, canvas.width/2, canvas.height - 10);
          ctx.fillStyle = 'white';
          ctx.fillText(document.getElementById("toptext").value, canvas.width/2, 30);
          ctx.fillText(document.getElementById("bottomtext").value, canvas.width/2, canvas.height - 10);
        };
        imageObj.src = imgurl;
      })
      .then(function() {
        // Get DataURL from canvas and store into storage.
        // Does not work, for some reason dataURL is blank
        var dataURL = document.getElementById("customMeme").toDataURL("image/png");
         console.log(dataURL);
         var user = firebase.auth().currentUser;
         uploadTask = firebase.storage().ref('user/' + user.uid).child(file.name).putString(dataURL, 'data_url').then(function(snapshot)
           {
             console.log('Uploading');
             return snapshot.ref.getDownloadURL();
           })
           .then(function(url) {
             console.log(`Successfully uploaded file and got download link - ${url}`);
             database.ref('users/' + user.uid + '/memes').push(url);
             console.log("Adding Your Meme");
             //document.getElementById('emptylibrary').removeChild(document.getElementById("customMeme"));
             return url;
           })
           .then(updateLibrary);
       });
    }
    document.getElementById("upload3").value = "";
  });
  document.getElementById('cucancel').addEventListener('click', function () {
    document.getElementById('cuModal').style.display = 'none';
  });
}

//Initialize account information / user state
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

// initialize app
window.onload = function() {
  initApp();
};
