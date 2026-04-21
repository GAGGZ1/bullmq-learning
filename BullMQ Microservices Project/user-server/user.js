const express=require('express');
const app=express();
const {Worker}=require("bullmq");
const port=5002;

app.use(express.json());
const userDB=[
  {
    id:1,
    name:"Gagan",
    password:"12345"
  }
];

const verificationWorker=new Worker(
  "user-verification-queue",
  async (job)=>{
    const userId=job.data.userId;
    console.log( `job recv with userId as ${userId}`);

    const isValidUser=userDB.some((item)=>item.id===userId);
    console.log(`User Valid ${isValidUser}`);
    console.log("Returning:", { isValidUser });
    return {isValidUser}
  },
  {
    connection: {
    host: "127.0.0.1",
    port: 6379
  }
  }
);

app.listen(port,()=>console.log("User server started at port 5002"))