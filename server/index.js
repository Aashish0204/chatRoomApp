//initializing the express app
const express = require('express');
const app= express();

//making the server
const http = require("http").Server(app);

//path for file path
var path = require('path');


//socket io
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '../client')));

//basic on root of page what should be sended as response
app.get('/',(req,res)=>{
    const filePath = path.join(__dirname,'../client/chatApp.html');
    res.sendFile(filePath);
})

let users = {};


io.on('connection',(socket)=>{

    console.log('sending connecction success event to client')

    socket.on('new_user_joined',(obj)=>{
        if(obj.userName){
            users[socket.id] = obj.userName;
        }
        // console.log(`user ${obj.userName} joined the room with id as ${socket.id}`);
        socket.broadcast.emit('new_user_joined_to_client' , obj );
    })

    socket.on('send_msg',(obj)=>{
        // obj.userName, obj.message
        // console.log(` user ${obj.userName} send a message as ${obj.message}`);
        socket.broadcast.emit('received_msg', obj);
    })


    socket.on('disconnect',()=>{
        const id = socket.id;
        // console.log(`user ${users[id]} left the room with id as ${socket.id}`);
        if(users[id]){
            socket.broadcast.emit('user_left_room_to_client', {userName : users[id]} );
        }
        delete users[id];
    })


})

//listening server at port 3000
http.listen(3008,(req,res)=>{
    console.log("listening at port 3008 ");
})

