const express=require('express');
const {Queue,QueueEvents}=require("bullmq");

const app=express();
const port = 5001;;

app.use(express.json());
const connection = {
  host: "127.0.0.1",
  port: 6379
};


const verifyUser = new Queue("user-verification-queue", { connection });
const verificationQueueEvents=new QueueEvents("user-verification-queue", { connection });

const mailQueue = new Queue("mail-queue", { connection });


app.post("/order", async (req, res) => {
  try {
    const { userId } = req.body;

    // Step 1: Verify user
    const job = await verifyUser.add("verify-user", { userId });

    const result = await job.waitUntilFinished(verificationQueueEvents);

    const isValidUser = result?.isValidUser ?? false;

    if (!isValidUser) {
      return res.send({ message: "User is not valid" });
    }

    // Step 2: Send mail (async, don't wait)
    await mailQueue.add("send-mail", {
      email: "user@example.com",
      message: "Order placed successfully!"
    });

    res.send({
      message: "Order placed & mail queued"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});


app.listen(port,()=> console.log("Order Server started at port 5001"));