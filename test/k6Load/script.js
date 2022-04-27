/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import { Counter } from 'k6/metrics';

import { sleep, check } from 'k6';

const CounterErrors = new Counter('Errors');

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 50,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 20,
      maxVUs: 400,
    },
  },
  // stages: [
  //   // { duration: '30s', target: 10 },
  //   // { duration: '30s', target: 50 },
  //   { duration: '5s', target: 10 },
  //   {
  //     duration: '5s', target: 100,
  //   },
  //   {
  //     duration: '10s', target: 100,
  //   },
  //   {
  //     duration: '2m', target: 100,
  //   },
  //   { duration: '10s', target: 100 },
  // ],
  thresholds: { Errors: ['count<100'] },
};

export default () => {
  const randomProduct = Math.floor(Math.random() * 1000011);
  // const res = http.get(`http://localhost:3000/reviews/?product_id=${randomProduct}`);
  // check(res, { 'status was 200': (r) => r.status === 200 });
  const responses = http.get(`http://localhost:3000/reviews/meta/?product_id=${randomProduct}`);
  // ['GET', `http://localhost:3000/reviews/meta/?product_id=${randomProduct}`],
  // ]);
  // if (responses[0].status !== 200) {
  //   CounterErrors.add(1, { errorType: 'error' });
  // }
  check(responses, {
    'main page status was 200': (res) => res.status === 200,
  });
  sleep(1);
};
