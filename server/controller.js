/* eslint-disable camelcase */
// const Photos = require('../dbms/postgres/Schemas/Photos');
// const { URL } = require('url');

const { pool } = require('../dbms/postgres/postgres');

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
      const queryString = `SELECT r.id as review_id, r.rating,
                                  r.summary, r.recommended as recommend,
                                  r.response, r.body, r.date,
                                  r.reviewer_name, r.helpfulness, r.reported as reported, COALESCE(json_agg(
                                  json_build_object(
                                    'id', p.id,
                                    'url', p.url)) FILTER (WHERE p.id IS NOT NULL), '[]') AS photos
                          FROM reviews r LEFT OUTER JOIN photos p ON p.review_id = r.id
                          WHERE r.product_id = ${product_id} AND r.reported = NOT 't' GROUP BY r.id
                          ${orderBy}
                          LIMIT ${count} OFFSET ${(page - 1) * count};`;
      // pool.connect()
      //   .then((client) => {
      pool.query(queryString)
        .then((Result) => { dbReviews.results = Result.rows; res.send(dbReviews); })
        .catch((err) => { res.send(err); pool.query('ROLLBACK'); })
        .finally(() => {
          // client.release();
        });
        // });
    }
  },
  meta: (req, res) => {
    const { product_id } = req.query;
    if (!product_id) {
      res.status(500).send('no product id');
    } else {
      const reviewMetaQueryString1 = `SELECT json_build_object(
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
      const reviewMetaQueryString2 = `with characteristics_meta as(
                                        select json_build_object(
                                          'id', c.id,
                                          'value', avg(cr.value)) as meta,
                                          c.name as name from characteristic_reviews cr
                                          inner join reviews r on r.id = cr.review_id
                                          inner join characteristics c on c.id = cr.characteristic_id
                                          where r.product_id = ${product_id} group by c.id)
                                      select json_build_object(
                                        'characteristics', json_object_agg(
                                          cm.name, cm.meta)) as meta
                                      from characteristics_meta cm;`;
      const dbReviewsMeta = {
        product_id: Number(product_id),
      };
      // pool.connect()
      //   .then((client) => {
      Promise.all(
        [pool.query(reviewMetaQueryString1)
          .then((result) => result.rows)
          .catch((err) => err),
        pool.query(reviewMetaQueryString2)
          .then((result) => result.rows)
          .catch((err) => err),
        ],
      )
        .then((results) => {
          Object.assign(dbReviewsMeta, results[0][0].q1);
          Object.assign(dbReviewsMeta, results[1][0].meta);
          res.send(dbReviewsMeta);
        })
        .catch((err) => res.send(err))
        .finally(() => {
          // client.release();
        });
      // });
    }
  },
  post: (req, res) => {
    const {
      product_id, rating, summary, body,
      recommend, name, email, photos, characteristics,
    } = req.body;
    (async () => {
      try {
        const client = await pool.connect();
        await client.query('BEGIN');
        const reviewInsertText = 'INSERT INTO reviews (product_id, rating, summary, body, recommended, reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;';
        const reviewInsertValues = [product_id, rating, summary, body, recommend, name, email];
        const reviewResponse = await client.query(reviewInsertText, reviewInsertValues);

        let photoInsertText = 'INSERT INTO photos(review_id, url) VALUES ';
        const photoInsertValue = [];
        photos.forEach((photo, index) => {
          if (index !== photos.length - 1) {
            photoInsertText += ` ($${(index * 2) + 1}, $${(index * 2) + 2}),`;
          } else {
            photoInsertText += ` ($${(index * 2) + 1}, $${((index * 2) + 2)});`;
          }
          photoInsertValue.push(reviewResponse.rows[0].id, photos[index]);
        });

        const photoResponse = await client.query(photoInsertText, photoInsertValue);

        let characteristicReviewsInsertText = 'INSERT INTO characteristic_reviews (characteristic_id, review_id, value) VALUES';
        const characteristicReviewsInsertValue = [];

        Object.keys(characteristics).forEach((charId, index, chars) => {
          if (index !== chars.length - 1) {
            characteristicReviewsInsertText += ` ($${(index * 3) + 1}, $${(index * 3) + 2}, $${(index * 3) + 3}),`;
          } else {
            characteristicReviewsInsertText += ` ($${(index * 3) + 1}, $${(index * 3) + 2}, $${(index * 3) + 3});`;
          }
          characteristicReviewsInsertValue
            .push(charId, reviewResponse.rows[0].id, characteristics[charId]);
        });
        await client.query(characteristicReviewsInsertText, characteristicReviewsInsertValue);
        await client.query('COMMIT');
        await client.release();
        res.send('im finally back');
      } catch (e) {
        await pool.query('ROLLBACK');
      }
    })().catch((e) => console.error(e.stack));
  },
  put: (req, res) => {
    if (req.url.includes('helpful')) {
      // pool.connect()
      //   .then((client) => {
      pool.query(`UPDATE reviews set helpfulness = helpfulness + 1 WHERE id = ${req.params.review_id}`)
        .then((response) => { res.status(202).send({ message: 'review was updated', response }); })
        .catch(() => { res.status(500).send({ message: 'review was not updated' }); })
        .finally(() => {
          // client.release();
        });
    // });
    }
    if (req.url.includes('report')) {
      // pool.connect()
      //   .then((client) => {
      pool.query(`UPDATE reviews set reported = 't' WHERE id = ${req.params.review_id}`)
        .then((response) => { res.status(202).send({ message: 'review was reported', response }); })
        .catch(() => { res.status(500).send({ message: 'review was not reported' }); })
        .finally(() => {
          // client.release();
        });
      // });
    }
  },
};

module.exports = { reviews };
