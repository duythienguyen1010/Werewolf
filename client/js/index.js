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
            
            socket.on('lobby', function(data) {
                for(var i = 0; i <data.length; i++) {
                    $("#lobby").text("");
                    $("#lobby").append(
                        "<p>" + data[i].name + "</p>" +
                        "<p>" + data[i].role + "</p>" +
                        "<p>" + data[i].id + "</p>"
                    )
                }
            });

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