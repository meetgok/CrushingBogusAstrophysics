sap.ui.define([
             "sap/ui/core/mvc/Controller",
             "sap/m/MessageToast",
             "sap/ui/model/json/JSONModel",
         ], function (Controller, MessageToast, JSONModel, o) {
             "use strict";
             var that;
             return Controller.extend("CrushingBogusAstrophysics.App", {
              onInit : function (oEvent)  {
                that = this;
                console.log("initated");
                //onload();
                this.o = {
                  "info":{"name":"", "roomName":"", "connected":"false"},
                  "rooms":[{
                    "roomName":"R1"
                    ,"content":[]}
                  ]
                }
                var oModel = new JSONModel(this.o);
                this.getView().setModel(oModel);
              },
              onPressConnect : function(){
                this.onload();
                this.Connect();
                this.bindMessageModel();
              },

              bindMessageModel : function (){
                this.o.info.room = this.getView().byId("idRoomName").getValue();
                this.o.info.name = this.getView().byId("idPersName").getValue();
                var oMes = this.o.rooms.filter(e => e.roomName == that.o.info.roomName);
                var msg = "";
                this.o.rooms[0].content.filter(e => msg = msg+"\n"+e.name + "-" + e.message)
                var oModel = new JSONModel(oMes, true);
                this.getView().setModel(oModel, "message");
                this.getView().byId("idTextArea").setValue(msg);
              },

              onShowHello : function () {
                  console.log("CrushingBogusAstrophysics");
                  this.Send()
              },

                            
               onload : function(){
                socket = io();
                usernameInput = that.o.info.name;
                chatIDInput = that.o.info.roomName;
                messageInput = that.o.info.text;
                chatRoom = that.o.info.roomName;
                dingSound = document.getElementById("Ding");

                socket.on("join", function(room){
                  console.log(room);
                })

                socket.on("recieve", function(message){
                  console.log(message);
                  var r = message.split(":");
                  var oModel = that.getView().getModel(oModel);
                  var oData = oModel.getData();
                  oData.rooms[0].content.push({"name":r[0], "message":r[1]});
                  oModel.setData(oData);
                    dingSound.currentTime = 0;
                    dingSound.play();
                that.bindMessageModel();
                  
                })
              },

              Connect : function(){
                socket.emit("join", chatIDInput, usernameInput);
                console.log("Connect");
              },

              Send : function(){
                if (delay && that.o.info.text.replace(/\s/g, "") != ""){
                  delay = false;
                  setTimeout(delayReset, 1000);
                  socket.emit("send", that.o.info.text);
                  that.o.info.text = "";
                this.bindMessageModel();
                }
              },

              delayReset : function(){
                delay = true;
              },
              onExit : function(oEvent){

              }
            });
         });