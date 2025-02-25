import {WebSocket} from "ws";
import {connection} from "websocket"
import { SENDMESSAGE,JOINROOM} from "./types/incoming";
import { intersection, string } from "zod";
interface User{
    name:string,
    userid:string,
    roomid:string,
    ws?:WebSocket;
}
interface room{
    user:User[]
}
interface Message{
   id:string,
   upvote:string,
   userid:string,
   roomid:string,
   downvote:string
}
const rooms:Map<number,room>=new Map();
export function sendtouser(message:string,socket:connection){
   const roomid=3;
   console.log(message);
   if(message=="roomid:3"){
    console.log("finsal chaec");
      socket.send(message);
   }
}
// const ws:WebSocket| null=null
export function adduser(ws:WebSocket){
   ws.on("message",(message:string)=>{
    const parsedmessage:JOINROOM|SENDMESSAGE=JSON.parse(message);
    // console.log(parsedmessage);
      if(parsedmessage.init=="JOIN_ROOM"){
        const roomid=parseInt(parsedmessage.roomid);
          if(rooms.get(parseInt(parsedmessage.roomid))){
            //    room.set(roomid,{name:parsedmessage.name,userid:parsedmessage.userId,roomid:parsedmessage.roomid});
              rooms.get(roomid)?.user.push({
                name:parsedmessage.name,
                userid:parsedmessage.userId,
                roomid:parsedmessage.roomid,
               
              })
          }else{
             rooms.set(roomid,{user:[]})
             rooms.get(roomid)?.user.push({
                name:parsedmessage.name,
                userid:parsedmessage.userId,
                roomid:parsedmessage.roomid,
             })
          }
          console.log("2",rooms.get(2));
          console.log("3",rooms.get(3))
      }
      if(parsedmessage.init=='SEND_MESSAGE'){
            const room=parseInt(parsedmessage.roomid);
            rooms.get(room)?.user.map((users)=>{      
            })
      }
      
   })         
}  
export function upvotelogic(message:Message){
   
}