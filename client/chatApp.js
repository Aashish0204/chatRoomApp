const socket = io('http://localhost:3008');
// console.log("socket connected to client side")


const chatRoom = document.getElementById('roomChat');
const formEle = document.getElementById('formId');


function appendMember(userName, msg, classes) {

    const newEle = document.createElement('div');

    if(classes == 'left'){
        //someone else message received
        newEle.classList.add(classes);
        newEle.classList.add('chat');

        const child = document.createElement('div');
        child.classList.add('chatContent');
        newEle.appendChild(child);

        newHeading = document.createElement('h4');
        newHeading.innerHTML = userName;

        newPara = document.createElement('p');
        newPara.innerHTML = msg;

        child.appendChild(newHeading);
        child.appendChild(newPara);

        chatRoom.appendChild(newEle);


    }
    else if(classes == 'right'){
        //you messaged something
        newEle.classList.add(classes);
        newEle.classList.add('chat');

        const child = document.createElement('div');
        child.classList.add('chatContent');
        child.innerHTML = msg;

        newEle.appendChild(child);
        chatRoom.appendChild(newEle);
    }
    else if(classes == 'center'){
        //some extra message is received
        newEle.classList.add('extraInfo');
        newEle.classList.add(classes);

        newEle.innerHTML = `${userName} ${msg}` ;
        chatRoom.appendChild(newEle);
    }
    else{
        alert('something went wrong');
    }

}


// console.log("connection is established successfully")

const displayName = prompt('Enter name to be displayed : ');

console.log(displayName)

if(displayName!="" && displayName != null && displayName != undefined && displayName != NaN){

    socket.emit('new_user_joined', { userName: displayName });

    appendMember("You" , "joined the room",'center' );

    socket.on('new_user_joined_to_client', (obj) => {
        appendMember(obj.userName, "joined the room", 'center',);
    })

    socket.on('user_left_room_to_client', (obj) => {
        appendMember(obj.userName, "left the room" ,'center');
    })

    socket.on('received_msg' , (obj)=>{
        appendMember(obj.userName , obj.message , 'left');
    })


    formEle.addEventListener('submit',(ev)=>{
        ev.preventDefault();
        const inputMsg = document.getElementById('inputMsg').value.trim();
        if(inputMsg){
            socket.emit('send_msg' , {userName : displayName , message : inputMsg});
            appendMember('You', inputMsg ,'right' );
            document.getElementById('inputMsg').value = "";
        }
    })


}
else{
    document.getElementsByClassName('container')[0].style.display = 'none';
}
