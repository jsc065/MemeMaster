function signUpModal() {
  $('#myModal').css('display', 'block');
  $('#signUpButton').click(function() {
    $('#myModal').css('display', 'none');
  });
  $('#cancel').click(function() {
    $('#myModal').css('display', 'none');
  });
}
$('#signup').click(function() {
  signUpModal();
});
$('#loginButton').click(function() {
  window.location.href="library.html";
});
