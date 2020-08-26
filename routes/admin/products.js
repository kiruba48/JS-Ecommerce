const express = require('express');
const multer = require('multer');

const { handleErrors } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsToRender = require('../../HTMLview/admin/products/index');
const newProductTemplate = require('../../HTMLview/admin/products/newProducts');
const { requireProductName, requireProductPrice } = require('./validator');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// route for Admin product list
router.get('/admin/products', async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsToRender({ products }));
});

// route for Admin product creation
router.get('/admin/products/new', (req, res) => {
  res.send(newProductTemplate({}));
});

// router to handle post request for product submission.
router.post(
  '/admin/products/new',
  upload.single('image'),
  [requireProductName, requireProductPrice],
  handleErrors(newProductTemplate),
  async (req, res) => {
    // parsing the image to string and selecting the title and price of the product and create a new product.
    // !!!!!Not for production grade application. only ok for practice!!!!!
    // console.log(req.file);
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.redirect('/admin/products');
  }
);

module.exports = router;
