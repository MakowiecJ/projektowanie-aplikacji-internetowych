const express = require('express');
const router = express.Router();

/* GET publications listing. */
router.get('/', (req, res) => {
  res.render('publications/index')
})

router.get('/new', (req, res) => {
  res.render('publications/new')
})

router.post('/', (req, res) => {
  res.send('Create')
})

module.exports = router;
