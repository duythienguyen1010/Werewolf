 $(document).ready(function(){
    var socket = io();
    
    var nameVal = '';

    $("#create_game_btn").click(function(){

        nameVal = $("#name_area").val()
        if(!isNaN(nameVal) || nameVal === '') {
            window.alert("Please enter a valid name");
        }
        else {
            socket.emit("create_game", {role:"Game Master", name:nameVal});

        }
    })

    $("#join_game_btn").click(function(){

        nameVal = $("#name_area").val()
        if(!isNaN(nameVal) || nameVal === '') {
            window.alert("Please enter a valid name");
        }
        else {

        }
    })

 });