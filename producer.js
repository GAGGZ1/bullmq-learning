const {Queue}=require('bullmq');

const notificationQueue=new Queue("email-queue");

async function init(){
  const res=notificationQueue.add("email to gagan",{
    email:"gagan@gmail.com",
    subject:"welcome",
    body:"hey gagan"
  });
  console.log("job added to queue: ",(await res).id);
};
 
init()
