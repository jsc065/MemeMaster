function passwordModal() {
  $('#pwModal').css('display', 'block');
  $('#passwordconfirm').click(function() {
    $('#pwModal').css('display', 'none');
  });
  $('#passwordcancel').click(function() {
    $('#pwModal').css('display', 'none');
  });
}
$('#changePass').click(function() {
  passwordModal();
});
