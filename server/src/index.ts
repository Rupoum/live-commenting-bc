import {WebSocketServer,WebSocket}  from "ws"
import { adduser, sendtouser } from "./roomlogic";
import { connection } from "websocket";
import { addsuser, downvote, removeuser, sendmessage, upvotelogic } from "./usermanager";
const socket=new WebSocketServer({port:4000});
const bufferarray={};
interface User{
    name:string,
    userid:string,
    roomid:string
}
// const websocket=new WebSocket({port:3001})
socket.on('connection',(ws:WebSocket)=>{
    //    console.log("C")
       
       ws.on('error',console.error);
       ws.on("message",(message:string)=>{
        const parsedmessage=JSON.parse(message);
         if(parsedmessage.type==="ADDUSER"){
             addsuser(parsedmessage.roomid,parsedmessage.name,ws,parsedmessage.userid);
             console.log("check");
         } 
         if(parsedmessage.type=="SENDMESSAGE"){
            console.log("asdasd");
              sendmessage(parsedmessage.roomid,ws,parsedmessage.message,parsedmessage.userid,parsedmessage.messageid);
         }  
         if(parsedmessage.type=="REMOVEUSER"){  
            removeuser(parsedmessage.roomid,parsedmessage.userid,ws);
         }
         if(parsedmessage.type=="UPVOTE"){
             upvotelogic(parsedmessage);
         }
         if(parsedmessage.type=="DOWNVOTE"){
            downvote(parsedmessage);
         }
       })
    //    ws.on('message',(messge)=>{
    //     console.log(messge.toString());
    //     adduser(ws)
    //    })

    //    ws.on("message",(message:string)=>{
    //     console.log("checke2");
    //     const parsedmessage:User=JSON.parse(message);
    //     console.log(parsedmessage);
    //     if(parsedmessage.roomid=='3'){
    //         console.log("final check");
    //     }
    //    })  
    //    ad
       ws.on('close',()=>{console.log("user is disconnected")});
       
    //    ws.on('message',function message(data:any){
        // console.log(data);
        // console.log("check1");
        // console.log(data);
        // if(data.type=="utf8"){
        // console.log(JSON.parse(data.utf8Data));}
        // socket.clients.forEach((clients)=>{
            // console.log(data);
            // console.log("check2");
            // ws.onmessage=(event)=>{
            //    clients.send(data,{binary:false});
            //     console.log(event.data);
            //  }
            // if(clients.readyState===WebSocket.OPEN){
            //    clients.send(data,{binary:false});
            //    console.log(data.toString());
              
            // @ts-ignore
            //    sendtouser(datas.toString(),ws);
            //    adduser(JSON.parse(message.utf8Data),ws);
            }
        )

