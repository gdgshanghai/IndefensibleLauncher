var currentDisplayTime = function() {
    return currentTime().getHours() + ":" + currentTime().getMinutes();
};

var initDemoTimeBox = function() {
    $('#current-button').text("现在是" + currentDisplayTime());
};

$(function() {
    initDemoTimeBox();
    $('.set-time').click(function() {
        var MAP = {
            'morning': '上午',
            'noon': '中午',
            'night': '晚上'
        }
        var id = $(this).attr('id');
        MODE = id === 'night' ? 'home' : 'work';
        $('#current-button').text("现在是" + MAP[id]);
        refreshMode();
        loadAppsByMode(MODE);
    });

    $("#noon").click(function(){
        $.ajax({
            url: 'http://memberappwebservice.duapp.com/api/dianping/business?latitude=31.18268013000488&longitude=121.42769622802734'
        }).done(function(data) {
            console.log(data.veneus[0].title);
            $('body').trigger('dianpingFood', data);
        }).fail(function(err) {
            console.log(err);
        });
    });
});
