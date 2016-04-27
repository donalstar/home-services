// JavaScript Document
function share(data) {
    data.url = data.url === undefined ? window.location.href : data.url;
    data.message = data.message === undefined ? '' : data.message;

    switch (data.network) {
        case 'facebook':
            var url = 'http://homeservices.trustcloud.com';

            popup('https://www.facebook.com/dialog/feed?app_id=' + fb_app_id + '&display=popup&caption='
                  + encodeURIComponent(data.message)
                  + '&link=' + encodeURIComponent(url)
                  + '&redirect_uri=' + encodeURIComponent(url));
            break;

        case 'twitter':
            popup('https://twitter.com/intent/tweet?text='
                + encodeURIComponent(data.message)
                + '&url=' + encodeURIComponent(data.url));
            break;

        default:
    }
}

function popup(link) {
    var window_settings =
    'width=640,height=500,scrollbars=no,resizable=yes,toolbar=no,directories=no,location=no,menubar=no,status=no,left=20%,top=20%';

    window.open(link, 'popup', window_settings);
}