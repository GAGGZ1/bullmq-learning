# BullMQ Example

This is a simple example demonstrating the use of BullMQ, a Node.js library for handling distributed jobs and messages using Redis.

## Overview

The project consists of two main components:

- **Producer** (`producer.js`): Adds jobs to a queue
- **Worker** (`worker.js`): Processes jobs from the queue

## Prerequisites

- Node.js
- Redis server running on localhost:6379

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure Redis is running on your system.

## Usage

1. Start the worker in one terminal:
   ```bash
   node worker.js
   ```

2. In another terminal, run the producer:
   ```bash
   node producer.js
   ```

The producer will add a job to the "email-queue", and the worker will process it by simulating sending an email.

## Dependencies

- `bullmq`: ^5.75.2