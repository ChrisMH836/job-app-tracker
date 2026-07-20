import express from 'express';

const router = express.Router();

router.get('/test-route', (req, res) => {
  res.json({ message: 'router test success' });
});

export default router;
