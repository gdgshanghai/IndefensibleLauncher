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
            'afternoon': '下午',
            'night': '晚上'
        }
        var id = $(this).attr('id');
        MODE = id === 'night' ? 'home' : 'work';
        $('#current-button').text("现在是" + MAP[id]);
        refreshMode();
        loadAppsByMode(MODE);
    });
});
