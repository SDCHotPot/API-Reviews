/* eslint-disable camelcase */
// const Photos = require('../dbms/postgres/Schemas/Photos');
// const { URL } = require('url');

const client = require('../dbms/postgres/postgres');

const reviews = {
  get: (req, res) => {
    const { product_id } = req.query;
    if (!product_id) {
      res.status(500).send('no product id');
    } else {
      let { page, count, sort } = req.query;
      sort = sort || 'newest';
      page = page || 1;
      count = count || 5;
      let orderBy;
      switch (sort) {
        case 'newest': orderBy = 'ORDER BY r.date DESC';
          break;
        case 'helpful': orderBy = 'ORDER BY r.helpfulness DESC';
          break;
        case 'relevant': orderBy = 'ORDER BY r.helpfulness DESC, r.date DESC';
          break;
        default: orderBy = null;
      }
      const dbReviews = {
        product: Number(product_id), page, count, sort,
      };
      const queryString = `SELECT r.*, COALESCE( json_agg(
                          json_build_object(
                              'id', p.id,
                              'url', p.url)) FILTER (WHERE p.id IS NOT NULL), '[]') AS photos
                          FROM reviews r LEFT OUTER JOIN photos p ON p.review_id = r.id
                          WHERE r.product_id = ${product_id} GROUP BY r.id
                          ${orderBy}
                          LIMIT ${count} OFFSET ${(page - 1) * count};`;
      client.query(queryString)
        .then((Result) => { dbReviews.results = Result.rows; res.send(dbReviews); })
        .catch((err) => { res.send(err); client.query('ROLLBACK'); });
    }
  },
  meta: (req, res) => {
    const { product_id } = req.query;

    const reviewMetaQueryString1 = `SELECT json_build_object(
                                   'review_total', COUNT(*),
                                   'recommended', json_build_object(
                                                  'true', COUNT(*) FILTER (WHERE r.recommended = 't'),
                                                  'false', COUNT(*) FILTER (WHERE r.recommended = 'f')),
                                                  'product_id', r.product_id,
                                                  'ratings' , json_build_object(
                                                            '1', count(*) FILTER (WHERE r.rating = 1),
                                                            '2', count(*) FILTER (WHERE r.rating = 2),
                                                            '3', count(*) FILTER (WHERE r.rating = 3),
                                                            '4', count(*) FILTER (WHERE r.rating = 4),
                                                            '5', count(*) FILTER (WHERE r.rating = 5)))::jsonb AS q1
                                    FROM reviews r WHERE r.product_id = ${product_id}
                                    GROUP BY r.product_id;`;

    const reviewMetaQueryString2 = `SELECT
                                    json_build_object(
                                    c.name, json_build_object(
                                            'id', cr.characteristic_id,
                                            'avg', avg(cr.value)))::jsonb as q2
                                    FROM reviews r INNER JOIN characteristic_reviews cr on r.id = cr.review_id
                                    INNER JOIN characteristics c on cr.characteristic_id = c.id WHERE r.product_id = ${product_id}
                                    GROUP BY r.product_id, c.name, cr.characteristic_id;`;
    const dbReviewsMeta = {
      product_id: Number(product_id),
    };

    Promise.all(
      [client.query(reviewMetaQueryString1)
        .then((result) => result.rows)
        .catch((err) => err),
      client.query(reviewMetaQueryString2)
        .then((result) => result.rows)
        .catch((err) => err)],
    )
      .then((results) => {
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
    req.body = {
      product_id: 1,
      rating: 4,
      summary: 'this is test summary',
      body: 'this is test body',
      recommend: true,
      name: 'testName',
      email: 'test@email.com',
      photos: ['p1', 'p2', 'p3'],
      characteristics: {
        1: 5,
        2: 4,
        3: 3,
        4: 2,
      },
    };
    const {
      product_id, rating, summary, body,
      recommend, name, email, photos, characteristics,
    } = req.body;
    (async () => {
      try {
        await client.query('BEGIN');
        const reviewInsertText = 'INSERT INTO reviews (product_id, rating, summary, body, recommended, reviewer_name, reviewer_email, response, helpfulness) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;';
        const reviewInsertValues = [product_id, rating, summary, body, recommend, name, email];
        const reviewResponse = await client.query(reviewInsertText, reviewInsertValues);

        let photoInsertText = 'INSERT INTO photos(review_id, url) VALUES ';
        const photoInsertValue = [];
        photos.forEach((photo, index) => {
          if (index === photos.length - 1) {
            photoInsertText += ` ($${(index * 2) + 1}, $${(index * 2) + 2}),`;
          } else {
            photoInsertText += ` ($${(index * 2) + 1}, $${(index * 2 + 1)});`;
          }
          photoInsertValue.push(reviewResponse.rows[0].id, photos[index]);
        });

        await client.query(photoInsertText, photoInsertValue);

        let characteristicReviewsInsertText = 'INSERT INTO characteristic_reviews (characteristic_id, review_id, value) VALUES';
        const characteristicReviewsInsertValue = [];

        Object.keys(characteristics).forEach((charId, index, chars) => {
          if (index === chars.length - 1) {
            characteristicReviewsInsertText += ` ($${(index * 3) + 1}, $${(index * 3) + 2}, $${(index * 3) + 3}),`;
          } else {
            characteristicReviewsInsertText += ` ($${(index * 3) + 1}, $${(index * 3) + 2}, $${(index * 3) + 3});`;
          }
          characteristicReviewsInsertValue.push(charId, reviewResponse.rows[0].id, chars[charId]);
        });

        await client.query(characteristicReviewsInsertText, characteristicReviewsInsertValue);
        await client.query('COMMIT');
        res.send('im finally back');
      } catch (e) {
        await client.query('ROLLBACK');
      } finally {
        client.release();
      }
    })().catch((e) => console.error(e.stack));
  },
  put: (req, res) => {
    if (req.url.includes('helpful')) {
      client.query(`UPDATE reviews set helpfulness = helpfulness + 1 WHERE id = ${req.params.review_id}`)
        .then((response) => { res.status(202).send({ message: 'review was updated', response }); })
        .catch((err) => { res.status(500).send({ message: 'review was not updated', err }); });
    }
    if (req.url.includes('report')) {
      client.query(`UPDATE reviews set reported = 'f' WHERE id = ${req.params.review_id}`)
        .then((response) => { res.status(202).send({ message: 'review was reported', response }); })
        .catch((err) => { res.status(500).send({ message: 'review was not reported', err }); });
    }
  },
};

module.exports = { reviews };
