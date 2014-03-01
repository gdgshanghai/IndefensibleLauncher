// var xhr = new XMLHttpRequest();
// //xhr.open("GET", "https://www.getpostman.com/collections/c594ef706d94e390f5c3", true);
// xhr.open("GET", "http://portal.qiniu.com/", true);
// xhr.onreadystatechange = function() {
//     if (xhr.readyState == 4) {
//         // WARNING! Might be injecting a malicious script!
//         document.getElementById("resp").innerHTML = xhr.responseText;
//     }
// }
// xhr.send();

$(function() {
    //alert('jquery ok');
    $(".tab-switcher").click(function(){
        var id = $(this).attr('id');
        id = id.replace('tab', 'launcher');
        $('#' + id).show().siblings('.launcher-content').hide();
        //alert('ok ' + id);
    });
});
