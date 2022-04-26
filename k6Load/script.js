import http from 'k6/http';
import { Counter } from 'k6/metrics';

import { sleep, check } from 'k6';

const CounterErrors = new Counter('Errors');

export const options = {
  stages: [
    // { duration: '30s', target: 10 },
    // { duration: '30s', target: 50 },
    { duration: '5s', target: 10 },
    { duration: '10s', target: 500 },
    { duration: '1m', target: 1000 },
    { duration: '1m30s', target: 1000 },
    { duration: '10s', target: 100 },
  ],
  thresholds: { Errors: ['count<100'] },
};

export default () => {
  const randomProduct = Math.floor(Math.random() * 1000011);
  // const res = http.get(`http://localhost:3000/reviews/?product_id=${randomProduct}`);
  // check(res, { 'status was 200': (r) => r.status === 200 });
  const responses = http.batch([
    ['GET', `http://localhost:3000/reviews/?product_id=${randomProduct}`],
    ['GET', `http://localhost:3000/reviews/meta/?product_id=${randomProduct}`],
  ]);
  if (responses.status !== 200) {
    CounterErrors.add(1, { errorType: 'error' });
  }
  check(responses[0], {
    'main page status was 200': (res) => res.status === 200,
  });
  sleep(1);
};
