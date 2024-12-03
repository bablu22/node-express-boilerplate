import { Job, Queue, Worker } from 'bullmq';
import { sendEmail } from '@/common/utils/sendEmail';
import { redisConnection } from '@/config/redis.config';

export const emailQueueName = 'emailQueue';

interface EmailJobDataType {
  to: string;
  subject: string;
  body: string;
}

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
});

// Worker to process email jobs
export const queueWorker = new Worker(
  emailQueueName,
  async (job: Job) => {
    const data: EmailJobDataType = job.data;
    await sendEmail(data.to, data.subject, data.body);
  },
  {
    connection: redisConnection,
  }
);
