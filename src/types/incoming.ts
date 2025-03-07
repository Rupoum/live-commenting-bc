
export type JOINROOM={
    init:"JOIN_ROOM",
    name:string,
    userId:string,
    roomid:string,
}
export type SENDMESSAGE={
    init:"SEND_MESSAGE",
    message:string
    roomid:string,
}
export type UPVOTE={
    type:"UPVOTE",
    userid:string,
    roomid:string,
    messageid:string
}
export type Downvvote={
    type:"DOWNVOTE"
    userid:string
    roomid:string
     messageid:string
}
