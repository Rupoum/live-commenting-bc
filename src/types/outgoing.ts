export type Message={
    userid:string,
    roomid:string,
    message:string,
     type:"MESSAGE",
     name:string
}
export type UPVOTE={
    roomid:string,
    messageid:string,
    userid:string,
    type:"UPVOTE",
    upvote:number,
    downvote:number
}
export type DOWNVOTE={
    roomid:string,
    messageid:string,
    type:"DOWNVOTE",
    upvote:number,
    downvote:number,
    userid:string
}
