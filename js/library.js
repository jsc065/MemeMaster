$('#cornerPic').click(function() {
  window.location.href="account.html";
});
function uploadModal() {
  $('#uploadModal').css('display', 'block');
  $('#uploadconfirm').click(function() {
    $('#uploadModal').css('display', 'none');
  });
  $('#uploadcancel').click(function() {
    $('#uploadModal').css('display', 'none');
  });
}
$('#upload, #upload2').click(function() {
  uploadModal();
});

function cuModal() {
  $('#cuModal').css('display', 'block');
  $('#cuconfirm').click(function() {
    $('#cuModal').css('display', 'none');
  });
  $('#cucancel').click(function() {
    $('#cuModal').css('display', 'none');
  });
}
$('#create').click(function() {
  cuModal();
});
