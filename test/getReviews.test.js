/* eslint-disable camelcase */
/* eslint-disable no-undef */
const axios = require('axios');
const {client} = require('../dbms/postgres/postgres')

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
  it('should not send back reviews if not product_id is specified per parameters', () => {
    axios.get(`${baseUrl}/reviews`, { params: { sort: 'newest' } })
      .then(() => {})
      .catch((err) => expect(err.response.data).toBe('no product id'))
      .finally(() => {});
  });
});

describe('making put request to the API', () => {
  it('should mark a review as helpful', () => {
    let helpfulness;
    const randomId = Math.ceil(Math.random() * 10000);
    let review_id;
    axios.get(`${baseUrl}/reviews`, { params: { product_id: randomId} })
      .then((results) => {
        helpfulness = results.data.results[0].helpfulness;
        review_id = results.data.results[0].review_id;
        axios.put(`${baseUrl}/reviews/${review_id}/helpful`)
          .then(() => {
            axios.get(`${baseUrl}/reviews`, { params: { product_id: randomId } })
              .then((results2) => {
                expect(results2.data.results[0].helpfulness).toEqual(helpfulness + 1);
              })
              .catch(() => {});
          })
          .catch(() => {});
      })
      .catch(() => {});
  });

  it('should mark a review as reported', async () => {
    let review_id;
    const randomId = Math.ceil(Math.random() * 10000);
    axios.get(`${baseUrl}/reviews`, { params: { product_id: randomId} })
      .then((results) => {
        reported = results.data.results[0].reported;
        review_id = results.data.results[0].review_id;
        axios.put(`${baseUrl}/reviews/${review_id}/report`)
          .then(() => {
            client.query(`SELECT r.* FROM reviews r WHERE r.id = ${review_id};`)
              .then((queryResults) => {
                client.end();
                expect(queryResults.rows[0].reported).toBeTruthy();
              }).catch((err) => console.log(err));
          }).catch((err) => console.log(err));
      }).catch((err) => console.log(err));
  });

  it('should not make put request for an invalid review_id', () => {
    const review_id = '123asd';
    axios.put(`${baseUrl}/reviews/${review_id}/helpful`)
      .then(() => {
      })
      .catch((err) => {
        expect(err.response.data.message).toBe('review was not updated')
      });
  });
});

// describe('closing the client', () => {
//   client.end();
// });
