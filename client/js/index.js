window.onload = function() {
    var socket = io();
        
    socket.on('assignRoles', function(data){
        for(var i = 0; i< data.length; i++)
            document.getElementById("screen").innerHTML = data[i].name + data[i].role;
    })
}