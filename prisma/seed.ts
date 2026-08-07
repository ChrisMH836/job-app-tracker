import { prisma } from '../src/config/db';
import { lastColumnOrder, lastJobItemOrder } from '../src/utils/dataUtils';
import bcrypt from 'bcrypt';
const testUsers = [
  {
    name: 'Chris',
    email: 'chris@test.com',
    password: '12345678',
    columns: [
      {
        name: 'Incomplete',
        jobItems: [
          {
            company: 'Google',
            title: 'Frontend Engineer',
            deadline: new Date('2026-09-15T00:00:00.000Z'),
            notes: 'Requires strong React and TypeScript experience.',
          },
          {
            company: 'Meta',
            title: 'Full Stack Developer',
            deadline: null,
            notes: 'Check referral network first.',
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
          },
          {
            company: 'Airbnb',
            title: 'Full Stack Engineer',
            deadline: new Date('2026-08-05T00:00:00.000Z'),
            notes: 'Initial recruiter call scheduled.',
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
    email: 'john@test.com',
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
          },
          {
            company: 'IBM',
            title: 'Systems Architect',
            deadline: null,
            notes: 'Hybrid role.',
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
          },
          {
            company: 'Palantir',
            title: 'Forward Deployed Engineer',
            deadline: new Date('2026-08-12T00:00:00.000Z'),
            notes: null,
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
    email: 'tom@test.com',
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
          },
          {
            company: 'Snap',
            title: 'AR Platform Engineer',
            deadline: null,
            notes: 'Check out lens studio frameworks.',
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
          },
          {
            company: 'Datadog',
            title: 'Frontend Developer',
            deadline: new Date('2026-08-20T00:00:00.000Z'),
            notes: 'Completed HackerRank challenge.',
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
      const columnOrder = (await lastColumnOrder(user.id)) + 1;
      const column = await prisma.column.create({
        data: {
          name: columnData.name,
          userId: user.id,
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
            order: jobOrder + 1,
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
