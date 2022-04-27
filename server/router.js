const router = require('express').Router();
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

router.get('/loaderio-9d9f7f71dfa6d3e77c5bbc7dc0c40f31/', (req, res) => {
  res.send('loaderio-9d9f7f71dfa6d3e77c5bbc7dc0c40f31');
});
module.exports = router;
