import {WebSocket} from "ws";
interface User{
    name:string,
    userid:string,
    ws?:WebSocket;
    message?:Message[]
}
interface room{
    user:User[]
}
interface Message{
    id:string,
    upvote:number,
    userid:string,
    roomid:string,
    downvote:number
 }

const rooms:Map<number,room>=new Map();
export function addsuser(roomid:string,name:string,socket:WebSocket,userid:string){
     const  roomids=parseInt(roomid);
    if(rooms.get(parseInt(roomid))){
      //    room.set(roomid,{name:parsedmessage.name,userid:parsedmessage.userId,roomid:parsedmessage.roomid});
        rooms.get(roomids)?.user.push({
          name:name,
          userid:userid,
          ws:socket
          // roomid:parsedmessage.roomid,
           
        })
    }else{
        rooms.set(roomids,{user:[]})
        rooms.get(roomids)?.user.push({
           name:name,
           userid:userid,
           ws:socket
           // roomid:parsedmessage.roomid,
        })
     }
     socket.on('close',()=>{
        removeuser(roomid,userid,socket);  
     })
     console.log("2",rooms.get(2));
     console.log("3",rooms.get(3));
}
export function removeuser(roomid:string,userId:string,socket:WebSocket){
    const roomId=parseInt(roomid);
    const room=rooms.get(roomId);
    if(!room){
        socket.send("No room for this id");
        return;
    }
    //  room.user.filter(({userid})=>userid==userId);
      for(let i=0;i<room.user.length;i++){
        if(room.user[i].userid==userId){
           room.user.splice(i,i+1);
        }
      }
      console.log(room);
    //   console.log("room",room.user);
      
    // console.log(rooms.get(2));
}
export function sendmessage(roomid:string,socket:WebSocket,message:string,userid:string,messageid:string){
        const roomId=parseInt(roomid);
        const room=rooms.get(roomId);
        if(!room){
            return socket.send("No room find for  a particular roomid");
        }
        else{
            const messages={
                id:messageid,
                upvote:0,
                userid:userid,
                roomid:roomid.toString(),
                downvote:0
            }
             for(let i=0;i<room.user.length;i++){
                if(room.user[i].userid==userid){
                    room.user[i].message?.push(messages);
                    console.log("finalcheck",rooms); 
                }
             }  
             console.log(room.user[0].message);       
              room.user.map((users)=>{
                users.ws?.send(message);
            })
        }
}

export function upvotelogic(message:Message){
    const roomId=parseInt(message.roomid);
    const count=message.upvote++;
   const room=rooms.get(roomId);
   const messagesda={...message,count};
   if(!room){
    return;
   }
   for(let i=0;i<room?.user.length;i++){
    // @ts-ignore
     if(room.user[i].message[0].id==message.id){
        console.log("final check");
         room.user[i].message?.push(messagesda); 
     }
   } 
   console.log(room);

}
// export function adduser(ws:WebSocket){
//    ws.on("message",(message:string)=>{
//     const parsedmessage:JOINROOM|SENDMESSAGE=JSON.parse(message);
//     // console.log(parsedmessage);
//       if(parsedmessage.init=="JOIN_ROOM"){
//         const roomid=parseInt(parsedmessage.roomid);
//           if(rooms.get(parseInt(parsedmessage.roomid))){
//             //    room.set(roomid,{name:parsedmessage.name,userid:parsedmessage.userId,roomid:parsedmessage.roomid});
//               rooms.get(roomid)?.user.push({
//                 name:parsedmessage.name,
//                 userid:parsedmessage.userId,
//                 ws:ws
//                 // roomid:parsedmessage.roomid,
                 
//               })
//           }else{
//              rooms.set(roomid,{user:[]})
//              rooms.get(roomid)?.user.push({
//                 name:parsedmessage.name,
//                 userid:parsedmessage.userId,
//                 // roomid:parsedmessage.roomid,
//              })
//           }
//           console.log("2",rooms.get(2));
//           console.log("3",rooms.get(3))
//       }
//       if(parsedmessage.init=='SEND_MESSAGE'){
//             const room=parseInt(parsedmessage.roomid);
//             rooms.get(room)?.user.map((users)=>{
//                       users.ws?.send("heloo");
//             })
         
         
//       }
      
//    })      
// } 
