var endpoint = "https://www.jsonstore.io/3ddb5d8f291ce62962a86fc6ba8dd8bf20bccab748f0075e12d7b03539effa13";

function refresh(){
    setTimeout(function () {
        window.location.reload()
    }, 4000);
}

function showDiv(a){
    var b = "#"+a;
    $('#none').fadeOut(100); 
    $(b).fadeIn(1000); 
    if (a == "alert"){
        $(b).fadeOut(10000); 
    }
}

function showMsq(id,msg){
    document.getElementById(id).innerHTML = msg;
}

function validate(url) {
    var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (pattern.test(url)) {
        return true;
    } 
    alert("Url is not valid!");
    return false;
 }

function geturl(){
    var url = document.getElementById("urlinput").value;
    var protocol_ok = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("ftp://");
    var url_ok = validate(url);
    if(!protocol_ok && url_ok){
        newurl = "http://"+url;
        return newurl;
    }else if (url_ok == true){
        return url;
    }else if (url_ok == false){
        showDiv("alert");
        showMsq("alert","Use only http:// or https:// or ftp://");
        //refresh();
        return false;
    }
}

function getrandom() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    $.getJSON(endpoint + "/" + text, function (data) {
        data = data["result"];          
        if (data != null) {
            text = getrandom()
        }
    });
    return text;
    
}

function genhash(){
    if (window.location.hash == ""){
        var rndm = getrandom();
        //window.location.hash = rndm;
        return rndm;
    }
    return false;
}

function send_request(url,hashed) {
    $.ajax({
        'url': endpoint + "/" + hashed,
        'type': 'POST',
        'data': JSON.stringify(url),
        'dataType': 'json',
        'contentType': 'application/json; charset=utf-8'
})
}

function shorturl(){
    var longurl = geturl();
//     if (typeof document.getElementById("advurl").value === 'undefined'){
    var advurl = "";
    if (!document.getElementById("advurl")){
        advurl = "";
    }
    else {
        advurl = document.getElementById("advurl").value;
    }
    if (advurl==""){
        if (longurl != false){
            var h = genhash();
            if (h != false){
                send_request(longurl,h);
                showDiv("uri");
                var link = "http://iaeo.me/#" +h;
                var t = "Short Link : <a href='" + link + "'>" +link+"</a>";
                showMsq("uri",t);
                //document.getElementById("uri").innerHTML = "Short Link : http://iaeo.me/#"+h;
            }
        }
    }
    else{
        if (longurl != false){
            $.getJSON(endpoint + "/" + advurl, function (data) {
                data = data["result"];

                if (data != null) {
                    alert("URL used");
                }else{
                    send_request(longurl,advurl);
                    showDiv("uri");
                    var link = "http://iaeo.me/#" +advurl;
                    var t = "Short Link : <a href='" + link + "'>" +link+"</a>";
                    showMsq("uri",t);   
                }

            });
        }
    }
    
}

// function showAdvance(){
//        var t = "<div class='input-group mb-1'><div class='input-group-prepend'><span class='input-group-text' id='basic-addon3'>http://iaeo.me/#</span></div><input type='text' class='form-control' id='advurl' aria-describedby='basic-addon3'></div>";
//        showDiv("advanced");
//        showMsq("advanced",t);
// }

var hashh = window.location.hash.substr(1)

if (window.location.hash != "") {
    $.getJSON(endpoint + "/" + hashh, function (data) {
        data = data["result"];

        if (data != null) {
            window.location.href = data;
        }

    });
}
