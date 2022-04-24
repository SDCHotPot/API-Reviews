// /* eslint-disable camelcase */
// const client = require('../dbms/postgres/postgres');

// const helper = {

//   getReviews: (req, res) => {
//     const { product_id } = req.query;
//     let { page, count, sort } = req.query;
//     const dbReviews = {
//       product: Number(product_id), page, count, sort,
//     };
//     sort = sort || 'newest';
//     // sort can be newest, helpful or relevant
//     page = page || 1;
//     count = count || 5;
//     let orderBy;
//     switch (sort) {
//       case 'newest': orderBy = 'ORDER BY r.date DESC';
//         break;
//       case 'helpful': orderBy = 'ORDER BY r.helpfulness DESC';
//         break;
//       default: orderBy = null;
//     }
// const queryString = `SELECT r.*, json_agg(json_build_object( 'id', p.id, 'url', p.url)) as photos
//                         FROM reviews r INNER JOIN photos p ON p.review_id = r.id
//                         WHERE r.product_id = ${product_id}
//                         GROUP by r.id
//                         ${orderBy}
//                         LIMIT ${count} OFFSET ${count * (page - 1)}
//                         ;`;
//     return client.query(queryString)
//       .then((Result) => {
//         dbReviews.results = Result.rows;
//         res.send(dbReviews);
//       })
//       .catch((err) => res.send(err));
//   },
// };

// module.exports = { helper };
