const router = require('express').Router();
const controller = require('./controller');

router.get('/reviews', (req, res) => {
  controller.reviews.get(req, res);
});
router.get('/reviews/meta', (req, res) => {
  controller.reviews.meta(req, res);
});

module.exports = router;
