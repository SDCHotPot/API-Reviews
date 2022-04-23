/* eslint-disable camelcase */
// const Photos = require('../dbms/postgres/Schemas/Photos');
const client = require('../dbms/postgres/postgres');

const reviews = {
  get: (req, res) => {
    const { product_id } = req.query;
    if (!product_id) {
      res.status(500).send('no product id');
    } else {
      let { page, count, sort } = req.query;
      sort = sort || 'newest';
      page = page || 0;
      count = count || 5;
      let orderBy;
      switch (sort) {
        case 'newest': orderBy = 'ORDER BY r.date DESC';
          break;
        case 'helpful': orderBy = 'ORDER BY r.helpfulness DESC';
          break;
        default: orderBy = null;
      }
      const dbReviews = {
        product: Number(product_id), page, count, sort,
      };
      const queryString = `SELECT r.*, json_agg(json_build_object( 'id', p.id, 'url', p.url)) as photos
                          FROM reviews r left outer JOIN photos p ON p.review_id = r.id
                          WHERE r.product_id = ${product_id}
                          GROUP by r.id
                          ${orderBy}
                          LIMIT ${count}
                          ;`;

      client.query(queryString)
        .then((Result) => {
          dbReviews.results = Result.rows;
          res.send(dbReviews);
        })
        .catch((err) => res.send(err));
    }
  },
  meta: (req, res) => {
    const { product_id } = req.query;

    const reviewMetaQueryString1 = `select json_build_object(
                                   'review_total', count(*),
                                   'recommended', json_build_object(
                                                  'true', count(*) filter (where r.recommended = 't'),
                                                  'false', count(*) filter (where r.recommended = 'f')),
                                                  'product_id', r.product_id,
                                                  'ratings' , json_build_object(
                                                  '1', count(*) filter(where r.rating = 1),
                                                  '2', count(*) filter (where r.rating = 2),
                                                  '3', count(*) filter (where r.rating = 3),
                                                  '4', count(*) filter (where r.rating = 4),
                                                  '5', count(*) filter (where r.rating = 5)))::jsonb as q1
                                    from reviews r where r.product_id = ${product_id}
                                    group by r.product_id;`;

    const reviewMetaQueryString2 = `select
                                    json_build_object(
                                    c.name, json_build_object(
                                            'id', cr.characteristic_id,
                                            'avg', avg(cr.value)))::jsonb as q2
                                    from reviews r inner join characteristic_reviews cr on r.id = cr.review_id
                                    inner join characteristics c on cr.characteristic_id = c.id where r.product_id = ${product_id}
                                    group by r.product_id, c.name, cr.characteristic_id;`;
    const dbReviewsMeta = {
      product_id: Number(product_id),
    };
    const query1 = client.query(reviewMetaQueryString1)
      .then((result) => result.rows)
      .catch((err) => err);

    const query2 = client.query(reviewMetaQueryString2)
      .then((result) => result.rows)
      .catch((err) => err);

    Promise.all([query1, query2])
      .then((results) => {
        console.log(results[1]);
        Object.assign(dbReviewsMeta, results[0][0].q1);
        dbReviewsMeta.characteristics = {};
        results[1].forEach((result) => {
          Object.assign(dbReviewsMeta.characteristics, result.q2);
        });
        res.send(dbReviewsMeta);
      })
      .catch((err) => res.send(err));
  },
  post: (req, res) => {
    res.send('hello from post');
  },
  put: (req, res) => {
    res.send('hello from put');
  },
};

module.exports = { reviews };
