# BullMQ Microservices Project (Node.js + Redis + Docker)

## Overview

This project demonstrates a **microservices-based architecture** using a message queue system built with **BullMQ** and **Redis**. It simulates a simple e-commerce workflow where services communicate asynchronously using queues.

The goal is to understand:
- How message queues work in real systems
- How microservices communicate without tight coupling
- How to scale background job processing

---

## Architecture

### Services

1. **Order Service**
   - Accepts order requests
   - Pushes jobs to queue

2. **User Service**
   - Handles user-related logic (mocked/basic)

3. **Mail Service**
   - Processes jobs from queue
   - Sends email (simulated)

---

### Flow


Client → Order Service → Queue (BullMQ + Redis) → Worker (Mail Service)


- Order service does NOT wait for mail to be sent
- Mail service processes jobs asynchronously

---

## Tech Stack

- **Node.js**
- **Express.js**
- **BullMQ**
- **Redis**
- **Docker**
- **Postman** (for testing)
- **Redis Insight** (optional GUI)

---

## Key Concepts

### 1. Message Queue

A message queue allows services to communicate asynchronously.

Instead of:

Service A → directly calls → Service B


We use:

Service A → Queue → Service B


---

### 2. Why use BullMQ

- Built on Redis
- High performance (Lua scripts + pipelining)
- Reliable job processing
- Supports retries, delays, concurrency

---

### 3. Job Lifecycle

1. Job added to queue
2. Worker picks job
3. Job processed
4. Emits:
   - `completed`
   - `failed`

---

### 4. Exactly-once semantics (practically)

BullMQ aims for:
- **At least once delivery**
- You must design jobs to be **idempotent**

---

## Project Structure (Example)


project/
│
├── order-service/
│   ├── server.js
│   └── queue.js
│
├── mail-service/
│   └── worker.js
│
├── docker-compose.yml
└── README.md

````

---

## Setup Instructions

### 1. Start Redis using Docker

```bash
docker run -d -p 6379:6379 redis
````

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Run services

Start Order Service:

```bash
node order-service/server.js
```

Start Worker (Mail Service):

```bash
node mail-service/worker.js
```

---

## Example Code

### Adding a Job (Order Service)

```js
const { Queue } = require("bullmq");

const queue = new Queue("mail-queue", {
  connection: { host: "localhost", port: 6379 }
});

await queue.add("send-mail", {
  email: "user@example.com",
  message: "Order placed successfully"
});
```

---

### Processing a Job (Mail Service)

```js
const { Worker } = require("bullmq");

const worker = new Worker("mail-queue", async job => {
  console.log("Sending email to:", job.data.email);
});
```

---

## Scaling

### Horizontal Scaling

* Add more worker instances:

```
node worker.js (x N times)
```

* Jobs processed in parallel

---

### Why this scales

* Services are independent
* Workers can increase based on load
* Queue buffers traffic spikes

---

## Important Production Concepts

### 1. Async APIs

* API responds immediately
* Work happens in background

---

### 2. Retry Mechanism

```js
queue.add("job", data, {
  attempts: 3
});
```

---

### 3. Rate Limiting

Prevent overload:

```js
limiter: {
  max: 10,
  duration: 1000
}
```

---

### 4. Idempotency

Jobs must be safe to run multiple times

---

### 5. Monitoring

Use:

* Redis Insight
* Logs
* Metrics

---

## When to Use Message Queues

* Email sending
* Payment processing
* Notifications
* Video processing
* Background jobs

---

## When NOT to Use

* Real-time blocking operations
* Immediate response requirements

---

## Key Learnings

* Microservices should be loosely coupled
* Queues improve scalability and reliability
* APIs should remain fast and non-blocking
* Background processing is essential in production systems

---

## Future Improvements

* Add authentication (JWT)
* Add API Gateway
* Add database (MongoDB/Postgres)
* Add event-driven architecture
* Add monitoring (Prometheus + Grafana)
* Add autoscaling (Kubernetes + KEDA)

---

## Conclusion

This project demonstrates how to:

* Build scalable microservices
* Use BullMQ for async communication
* Design systems that handle real-world load

Queues are a **core building block** in modern backend systems.

---

```
```
