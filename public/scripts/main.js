$(function () {

    /* get user from local storage */
    var user = amplify.store("user");
    if(user != undefined){
        /* set loaded token to header */
        setHeaderToken(user.token);
    }

    /* on apicall button press */
    $('.apicall').on('click', function () {
        $.ajax({
            type: 'GET',
            url: $(this).data("id")
        }).done(function (data,status,res) {
                log(res.status,JSON.stringify(data));
        }).fail(function (res) {
            log(res.status,res.responseText);
        }).always(function(res, status){
            $('#loginModal').modal((status=='success'?'hide':'show'));
        });
    });

    /* on form submit */
    $('#loginForm').submit(function (event) {
        event.preventDefault();
        /* reset user */
        amplify.store("user", null);
        setHeaderToken("");

        var user = {};
        user.username = $('#username').val();
        $.ajax({
            type: 'POST',
            url: "/api/authenticate",
            data: {username: user.username, password: $('#password').val()}
        }).done(function (data,status,res) {
            setHeaderToken(data.token);
            user.token = data.token;
            amplify.store("user", user);
            log(res.status,JSON.stringify(data));
        }).fail(function (res) {
                log(res.status,res.responseText);
        }).always(function(data, status){
          $('#loginModal').modal((status=='success'?'hide':'show'));
        });
    });

    /**
     * Set token to header
     * @param token
     */
    function setHeaderToken(token) {
        $.ajaxSetup({
            headers: { 'API-Token': token }
        });
    }

    /**
     * Append response data to log
     * @param status
     * @param message
     */
    function log(status, message) {
        $('.log').append('<div><span class="status">'+ status+'</span><span class="message">'+ message + '</span></div>');
    }
});


