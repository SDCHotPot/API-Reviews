// SELECT
//     reviews.product_id AS product_id,
//     json_build_object(
//       '1', (SELECT COUNT(rating) FROM reviews WHERE product_id = 145281
//       AND rating = 1),
//       '2', (SELECT COUNT(rating) FROM reviews WHERE product_id = 145281
//       AND rating = 2),
//       '3', (SELECT COUNT(rating) FROM reviews WHERE product_id = 145281
//       AND rating = 3),
//       '4', (SELECT COUNT(rating) FROM reviews WHERE product_id = 145281
//       AND rating = 4),
//       '5', (SELECT COUNT(rating) FROM reviews WHERE product_id = 145281
//       AND rating = 5)
//     ) AS rating,
//     json_build_object(
//       '0', (SELECT COUNT(recommended) FROM reviews WHERE recommended = 'false' AND product_id = 145281),
//       '1', (SELECT COUNT(recommended) FROM reviews WHERE recommended = 'true' AND product_id = 145281)
//     ) AS recommended,
//     json_object_agg(
//       characteristics.name, json_build_object(
//         'id', characteristics.id,
//         'value', (SELECT avg(characteristic_reviews.value) FROM characteristic_reviews WHERE characteristic_reviews.characteristic_id = characteristics.id)
//       )
//     ) AS characteristics
//     FROM reviews
//     LEFT JOIN characteristics ON characteristics.product_id = reviews.product_id
//     LEFT JOIN characteristic_reviews ON characteristic_reviews.characteristic_id = characteristics.id
//     WHERE reviews.product_id = 145281
//     GROUP BY reviews.product_id