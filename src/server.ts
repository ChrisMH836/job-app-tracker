import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Working');
});

const PORT: number = 5001;

app.listen(PORT, () => {
  console.log(`server created on port ${PORT}`);
});
