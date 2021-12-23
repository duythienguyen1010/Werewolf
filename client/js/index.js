 $(document).ready(function(){

    var socket = io();
    
    var nameVal = '';
    var roomID = '';

    $("#create_game_btn").click(function(){

        nameVal = $("#name_area").val()
        if(!isNaN(nameVal) || nameVal === '') {
            window.alert("Please enter a valid name");
        }
        else {
            socket.emit("create_game", {role:"Game Master", name:nameVal});

            $('#screen').text('');

            socket.on('display_master', function(data) {
                    $('#screen').append(
                        "<p>" + data.name + "</p>" +
                        "<p>" + data.role + "</p>" +
                        "<p>" + data.id + "</p>"
                    )
            });

        }
    })

    $("#join_game_btn").click(function(){

        nameVal = $("#name_area").val()
        if(!isNaN(nameVal) || nameVal === '') {
            window.alert("Please enter a valid name");
        }
        else {
            socket.emit("join_game", {name:nameVal});
            $('#screen').text('');
            $('#screen').append(
                "<input type=\"text\" id=\"room_area\" placeholder=\"enter your room id\">" +
                "<input type=\"button\" id=\"find_room_btn\" value=\"Enter room\">"
            )

            roomID = $("#room_area").val();

            $('#find_room_btn').click(function(){
                window.alert(roomID);
                socket.emit('find_room', roomID);
            })
        }
    })

 });