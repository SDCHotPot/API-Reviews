/* eslint-disable camelcase */
/* eslint-disable no-undef */
const axios = require('axios');

const baseUrl = 'http://localhost:3000';

describe('contacting the API for reviews ', () => {
  const params = {
    product_id: 1,
  };
  it('should retrieve reviews for a specified product', () => {
    axios.get(`${baseUrl}/reviews`, { params })
      .then((results) => {
        expect(results.data.results).toBeDefined();
      });
  });
  it('should retrieve a list of reviews', () => {
    axios.get(`${baseUrl}/reviews`, { params })
      .then((results) => {
        expect(Array.isArray(results.data.results)).toBeTruthy();
      });
  });
  it('should retrieve a list of reviews specified by count', () => {
    params.count = 1;
    axios.get(`${baseUrl}/reviews`, { params })
      .then((results) => {
        expect((results.data.results)).toHaveLength(params.count);
      });
  });
  it('should retrieve a list of reviews specified by the product_id', () => {
    const product1 = axios.get(`${baseUrl}/reviews`, { params: { product_id: 1 } });
    const product2 = axios.get(`${baseUrl}/reviews`, { params: { product_id: 2 } });
    Promise.all([product1, product2])
      .then((results) => {
        expect((results[0].data.product)).not.toEqual(results[1].data.product);
      })
      .catch(() => {
      });
  });
  it('should sort the list of reviews by sort parameters', () => {
    axios.get(`${baseUrl}/reviews`, { params: { product_id: 4, sort: 'newest' } })
      .then((results) => {
        expect(results.data.results[0].date.getTime())
          .toBeLessThan(results.data.results[1].date.getTime());
      })
      .catch(() => {
      });
  });
});

describe('marking that a review is helpful', () => {
  let helpfulness;
  const randomId = Math.ceil(Math.random() * 10000);
  axios.get(`${baseUrl}/reviews/`, { params: { product_id: randomId } })
    .then((results) => {
      const reviewNumber = results.data.results[0].id;
      helpfulness = results.data.results[0].helpfulness;
      axios.put(`${baseUrl}/review/${reviewNumber}/helpful`)
        .then(() => {
          axios.get(`${baseUrl}/reviews/`, { params: { product_id: randomId } })
            .then((results2) => {
              expect(results2.data.results[0].helpfulness).toEqual(helpfulness + 1);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
