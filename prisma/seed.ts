import { prisma } from '../src/config/db';
import { lastColumnOrder, lastJobItemOrder } from '../src/utils/dataUtils';
import { JobStatus } from '../generated/prisma';
import bcrypt from 'bcrypt';
const testUsers = [
  {
    name: 'Chris',
    email: 'Chris@test.com',
    password: '123',
    columns: [
      {
        name: 'Incomplete',
        jobItems: [
          {
            company: 'Google',
            title: 'Frontend Engineer',
            deadline: new Date('2026-09-15T00:00:00.000Z'),
            notes: 'Requires strong React and TypeScript experience.',
            status: 'SAVED',
          },
          {
            company: 'Meta',
            title: 'Full Stack Developer',
            deadline: null,
            notes: 'Check referral network first.',
            status: 'SAVED',
          },
        ],
      },
      {
        name: 'Applied',
        jobItems: [
          {
            company: 'Stripe',
            title: 'Backend Engineer',
            deadline: new Date('2026-08-01T00:00:00.000Z'),
            notes: 'Submitted resume via portal.',
            status: 'APPLIED',
          },
          {
            company: 'Airbnb',
            title: 'Full Stack Engineer',
            deadline: new Date('2026-08-05T00:00:00.000Z'),
            notes: 'Initial recruiter call scheduled.',
            status: 'INTERVIEW',
          },
        ],
      },
      {
        name: 'Offered',
        jobItems: [
          {
            company: 'Spotify',
            title: 'Web Audio Engineer',
            deadline: null,
            notes: 'Received competitive offer!',
            status: 'OFFER',
            offer: {
              startDate: new Date('2026-09-01T00:00:00.000Z'),
              endDate: null,
            },
          },
          {
            company: 'Dropbox',
            title: 'Software Engineer',
            deadline: null,
            notes: 'Passed final rounds, waiting on formal package.',
            status: 'OFFER',
            offer: {
              startDate: new Date('2026-09-15T00:00:00.000Z'),
              endDate: null,
            },
          },
        ],
      },
    ],
  },
  {
    name: 'John',
    email: 'John@test.com',
    password: 'John_password',
    columns: [
      {
        name: 'Incomplete',
        jobItems: [
          {
            company: 'Oracle',
            title: 'Database Developer',
            deadline: new Date('2026-09-20T00:00:00.000Z'),
            notes: 'Focus on PL/SQL and performance tuning.',
            status: 'SAVED',
          },
          {
            company: 'IBM',
            title: 'Systems Architect',
            deadline: null,
            notes: 'Hybrid role.',
            status: 'SAVED',
          },
        ],
      },
      {
        name: 'Applied',
        jobItems: [
          {
            company: 'Cisco',
            title: 'Network Software Engineer',
            deadline: new Date('2026-08-10T00:00:00.000Z'),
            notes: 'Phone screen completed.',
            status: 'INTERVIEW',
          },
          {
            company: 'Palantir',
            title: 'Forward Deployed Engineer',
            deadline: new Date('2026-08-12T00:00:00.000Z'),
            notes: null,
            status: 'APPLIED',
          },
        ],
      },
      {
        name: 'Offered',
        jobItems: [
          {
            company: 'Intel',
            title: 'Firmware Engineer',
            deadline: null,
            notes: 'Got the job offer!',
            status: 'OFFER',
            offer: {
              startDate: new Date('2026-10-01T00:00:00.000Z'),
              endDate: null,
            },
          },
          {
            company: 'AMD',
            title: 'GPU Software Engineer',
            deadline: null,
            notes: 'Strong team match.',
            status: 'OFFER',
            offer: {
              startDate: new Date('2026-10-15T00:00:00.000Z'),
              endDate: null,
            },
          },
        ],
      },
    ],
  },
  {
    name: 'Tom',
    email: 'Tom@test.com',
    password: 'Tom_password',
    columns: [
      {
        name: 'Incomplete',
        jobItems: [
          {
            company: 'Adobe',
            title: 'Creative Cloud Web Engineer',
            deadline: new Date('2026-10-05T00:00:00.000Z'),
            notes: 'Canvas API and WebGL knowledge required.',
            status: 'SAVED',
          },
          {
            company: 'Snap',
            title: 'AR Platform Engineer',
            deadline: null,
            notes: 'Check out lens studio frameworks.',
            status: 'SAVED',
          },
        ],
      },
      {
        name: 'Applied',
        jobItems: [
          {
            company: 'Salesforce',
            title: 'Full Stack Developer',
            deadline: new Date('2026-08-18T00:00:00.000Z'),
            notes: 'Waiting for take-home project feedback.',
            status: 'APPLIED',
          },
          {
            company: 'Datadog',
            title: 'Frontend Developer',
            deadline: new Date('2026-08-20T00:00:00.000Z'),
            notes: 'Completed HackerRank challenge.',
            status: 'INTERVIEW',
          },
        ],
      },
      {
        name: 'Offered',
        jobItems: [
          {
            company: 'VMware',
            title: 'Cloud Infrastructure Engineer',
            deadline: null,
            notes: 'Offer accepted.',
            status: 'OFFER',
            offer: {
              startDate: new Date('2026-09-01T00:00:00.000Z'),
              endDate: null,
            },
          },
          {
            company: 'Red Hat',
            title: 'Open Source Software Engineer',
            deadline: null,
            notes: 'Great culture and benefits package.',
            status: 'OFFER',
            offer: {
              startDate: new Date('2026-09-15T00:00:00.000Z'),
              endDate: null,
            },
          },
        ],
      },
    ],
  },
];
async function main() {
  const deleteCount = await prisma.user.deleteMany();
  console.log(`successfully deleted ${deleteCount.count} users`);
  console.log('begin seeding Data');
  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
    });
    for (const columnData of userData.columns) {
      const columnOrder = await lastColumnOrder(user.id);
      const column = await prisma.column.create({
        data: {
          name: columnData.name,
          userId: user.id,
          jobCount: 0,
          order: columnOrder,
        },
      });
      for (const jobItemData of columnData.jobItems) {
        const jobOrder = await lastJobItemOrder(column.id);
        const jobItem = await prisma.jobItem.create({
          data: {
            columnId: column.id,
            company: jobItemData.company,
            title: jobItemData.title,
            deadline: jobItemData.deadline,
            notes: jobItemData.notes,
            status: jobItemData.status as JobStatus,
            order: jobOrder,
          },
        });
        console.log(
          `-        succesfully added jobItem: ${jobItem.company} - ${jobItem.title}`,
        );
      }
      console.log(`-    succesfully added column: ${columnData.name}`);
    }
    console.log(`finished seeding: ${userData.name}`);
  }
}
main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
