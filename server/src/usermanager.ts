import {WebSocket} from "ws";
interface User{
    name:string,
    userid:string,
    ws?:WebSocket;
    // message?:Message[]
}
interface room{
    user:User[]
    message?:Message[]
}
interface Message{
    messageid:string,
    upvote:number,
    userid:string,
    roomid:string,
    downvote:number,
    upvotedid?:string[],
    downvoteid?:string[]
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
    if(!room?.message){
        socket.send("No room for this id");
        return;
    }
    //  room.user.filter(({userid})=>userid==userId);
      for(let i=0;i<room.user.length;i++){
        if(room.user[i].userid==userId){
           room.user.splice(i,i+1);
        }
      }
      for(let i=0;i<room.message?.length;i++){
        // @ts-ignore
         for(let j=0;j<room.message[i].downvoteid?.length;j++){
            // @ts-ignore
           if(room.message[i].downvoteid[j]==userId){
                room.message[i].downvote--;
           }  
         } 
        // @ts-ignore
         for(let j=0;j<room.message[i].upvotedid?.length;j++){
            // @ts-ignore
            if(room.message[i].upvotedid[j]==userId){
                room.message[i].upvote--;
            }
         }
      }
      console.log(room);
    //   console.log("room",room.user);
      
    // console.log(rooms.get(2));
}
export function sendmessage(roomid:string,socket:WebSocket,message:string,userids:string,messageid:string,name:string){
        const roomId=parseInt(roomid);
        const room=rooms.get(roomId);
        if(!room){
            return socket.send("No room find for  a particular roomid");
        }
        else{
            const messages={
                id:messageid,
                upvote:0,
                userid:userids,
                roomid:roomid.toString(),
                downvote:0
            }
             for(let i=0;i<room.user.length;i++){
                if(room.user[i].userid==userids){
                    console.log(messages);
                    if(!room.message){
                        room.message=[];
                    }
                      room.message?.push({messageid:messageid,
                        upvote:0,
                        userid:userids,
                        roomid:roomid.toString(),
                        upvotedid:[],
                        downvoteid:[],
                        downvote:0});
                      console.log(room.message);
                    console.log("finalcheck",rooms); 
                }
             }
              room.user.map(({ws})=>{
               const Message={
                userid:userids,
                roomid:roomid,
                message:message,
                 type:"MESSAGE",
                 name:name,
                 messageid:messageid
            }
              //  const userid=JSON.stringify(userids);
               ws?.send(JSON.stringify(Message));
            })
        }
}

export function upvotelogic(message:Message){
    const roomId=parseInt(message.roomid);
    // const count=message.upvote++;
   const room=rooms.get(roomId);
   if(!room?.message){
    // console.log(room);
    console.log("checke2");
    return;
   }
   let count=0;
    for(let i=0;i<room?.user.length;i++){
       if(room.user[i].userid==message.userid){
          count++;
       }
    }
    if(count==0){
        return;
    }
//    const messagesda={...message,count};
   
   for(let i=0;i<room?.message.length;i++){
        if(message.messageid==room.message[i].messageid){
          if(!room.message[i]){
            // console.log("check1");
            return;
          }
            // @ts-ignore
            for(let j=0;j<room.message[i].upvotedid?.length;j++){
                // @ts-ignore
                 if(room.message[i].upvotedid[j]==message.userid){
                    // console.log("check3");
                    return;  
                 }   
            }
            // @ts-ignore
            for(let j=0;j<room.message[i].downvoteid?.length;j++){
                // @ts-ignore
                  if(room.message[i].downvoteid[j]==message.userid){
                         room.message[i].downvoteid?.splice(j,j+1);
                           room.message[i].downvote--;
                  }

            }
            room.message[i].upvotedid?.push(message.userid);
            room.message[i].upvote++;
            room.user.map(({ws})=>{
              const UPVOTE={
                roomid:message.roomid,
                messageid:message.messageid,
                userid:message.userid,
                type:"UPVOTE",
                // @ts-ignore
                upvote:room.message[i].upvote,
                // @ts-ignore
                downvote:room.message[i].downvote
            }
                        ws?.send(JSON.stringify(UPVOTE));
                    
                 
            })
            
        }  
     } 
   } 
   export function downvote(message:Message){
    const roomId=parseInt(message.roomid);
    const room=rooms.get(roomId);
    if(!room?.message){
       return;
    }
    let count=0;
     for(let i=0;i<room.user.length;i++){
        if(room.user[i].userid==message.userid){
            count++;
        }
     }
     if(count==0){
        return;
     }
    for(let i=0;i<room.message.length;i++){
      if(room.message[i].messageid==message.messageid){
        if(room.message[i].downvoteid){
        // @ts-ignore
        for(let j=0;j<room.message[i].downvoteid?.length;j++){
            // @ts-ignore
              if(room.message[i].downvoteid[j]==message.userid){
                     return;    
              }
            
        }
    }   
        if(room.message[i].upvotedid){
          // @ts-ignore
        for(let j=0;j<room.message[i].upvotedid?.length;j++){
            // @ts-ignore
            if(room.message[i].upvotedid[j]==message.userid){
                room.message[i].upvotedid?.splice(j,j+1);
                 room.message[i].upvote--;
            }
        }
      }
        room.message[i].downvoteid?.push(message.userid);
        room.message[i].downvote++;
        // console.log(room.message[i]);
    
    room.user.map(({ws})=>{
      const DOWNVOTE={
        roomid:message.roomid,
        messageid:message.messageid,
        userid:message.userid,
        type:"DOWNVOTE",
        // @ts-ignore
        upvote:room.message[i].upvote,
        // @ts-ignore
        downvote:room.message[i].downvote
    }
                ws?.send(JSON.stringify(DOWNVOTE));
         
    })
   }
  }
}
//    console.log(room);


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
