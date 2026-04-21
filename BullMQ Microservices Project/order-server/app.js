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


app.post("/order", async (req, res) => {
  try {
    const { userId } = req.body;

    const job = await verifyUser.add("verify-user", { userId });

    console.log("JOB ADDED:", job.id);

    const result = await job.waitUntilFinished(verificationQueueEvents);

    console.log("JOB RESULT:", result);

    const isValidUser = result?.isValidUser ?? false;

    if (!isValidUser) {
      return res.send({ message: "User is not valid" });
    }

    res.send({ message: "User is valid" });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});


app.listen(port,()=> console.log("Order Server started at port 5001"));