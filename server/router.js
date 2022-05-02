const router = require('express').Router();
const path = require('path');
const controller = require('./controller');

router.get('/reviews', (req, res) => {
  controller.reviews.get(req, res);
});
router.get('/reviews/meta', (req, res) => {
  controller.reviews.meta(req, res);
});
router.post('/reviews', (req, res) => {
  controller.reviews.post(req, res);
});
router.put('/reviews/:review_id/helpful', (req, res) => {
  controller.reviews.put(req, res);
});
router.put('/reviews/:review_id/report', (req, res) => {
  controller.reviews.put(req, res);
});

router.get('/test', (req, res) => {
  console.log('im getting hit');
  res.send('hello World!');
});

module.exports = router;
