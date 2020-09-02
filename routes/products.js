const express = require('express');
const productsRepo = require('../repositories/products');
const productsRenderTemplate = require('../HTMLview/products/index');

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsRenderTemplate({ products }));
});

module.exports = router;
