var socket;
var usernameInput
var chatIDInput;
var messageInput;
var chatRoom;
var dingSound;
var messages = [];
var delay = true;

function onload(that){
  socket = io();
  usernameInput = that.o.info.name;
  chatIDInput = that.o.info.text;
  messageInput = that.o.info.text;
  chatRoom = that.o.info.roomName;
  dingSound = document.getElementById("Ding");

  socket.on("join", function(room){
    chatRoom.innerHTML = "Chatroom : " + room;
  })

  socket.on("recieve", function(message){
    console.log(message);
    if (messages.length < 9){
      messages.push(message);
      dingSound.currentTime = 0;
      dingSound.play();
    }
    else{
      messages.shift();
      messages.push(message);
    }
    for (i = 0; i < messages.length; i++){
        document.getElementById("Message"+i).innerHTML = messages[i];
        document.getElementById("Message"+i).style.color = "#303030";
    }
  })
}

function Connect(){
  socket.emit("join", chatIDInput.value, usernameInput.value);
  console.log("Connect");
}

function Send(){
  if (delay && messageInput.replace(/\s/g, "") != ""){
    delay = false;
    setTimeout(delayReset, 1000);
    socket.emit("send", messageInput);
    messageInput = "";
  }
}

function delayReset(){
  delay = true;
}