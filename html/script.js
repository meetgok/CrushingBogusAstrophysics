var socket;
var usernameInput
var chatIDInput;
var messageInput;
var chatRoom;
var dingSound;
var messages = [];
var delay = true;
var o;

function onload(that){
  o = that;
  socket = io();
  usernameInput = that.info.name;
  chatIDInput = that.info.roomName;
  messageInput = document.getElementById("__xmlview0--idText-inner");
  chatRoom = that.info.roomName;
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
  socket.emit("join", chatIDInput, usernameInput);
  console.log("Connect");
}

function Send(){
  if (delay && messageInput.value.replace(/\s/g, "") != ""){
    delay = false;
    setTimeout(delayReset, 1000);
    socket.emit("send", messageInput.value);
    messageInput.value = "";
  }
}

function delayReset(){
  delay = true;
}