function refresh_cc_stream_info() {
    var ccsib = document.getElementsByTagName('BODY')[0];
    var ccsis = document.createElement('script');
    ccsis.type = 'text/javascript';
    ccsis.src = window.ccsiu;
    ccsib.appendChild(ccsis)
    }
function cc_streaminfo_get_callback(ccsiv) {
    for (n in ccsiv)
        if (ccsie = document.getElementById('cc_stream_info_' + n))
        ccsie.innerHTML = ccsiv[n];
    window.ccsiu = ccsiv.url;
    if (window.ccsic++<10000)
        setTimeout('refresh_cc_stream_info()', 2000);
}
window.ccsic = 0;