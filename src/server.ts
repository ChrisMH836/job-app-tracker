import express from 'express';
import type { Express, Request, Response } from 'express';

//router
import testRouter from './routers/testRouter.ts';

// setting up express object
const app: Express = express();
app.use(express.json());

//endpoints and routers
app.use('/test', testRouter);
app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'connection success' });
});

//setting up ports
const PORT: number = 5001;

const server = app.listen(PORT, () => {
  console.log(`port activated at: ${PORT}`);
});
