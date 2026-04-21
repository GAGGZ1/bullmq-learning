const { Worker } = require("bullmq");

const connection = {
  host: "127.0.0.1",
  port: 6379
};

const mailWorker = new Worker(
  "mail-queue",
  async (job) => {
    const { email, message } = job.data;

    console.log("📧 Sending mail...");
    console.log("To:", email);
    console.log("Message:", message);

    // simulate delay
    await new Promise((res) => setTimeout(res, 1000));

    console.log("✅ Mail sent");

    return { success: true };
  },
  { connection }
);

console.log("Mail worker started...");