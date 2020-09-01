const express = require('express');
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsToRender = require('../../HTMLview/admin/products/index');
const newProductTemplate = require('../../HTMLview/admin/products/newProducts');
const productEditTemplate = require('../../HTMLview/admin/products/edit');
const { requireProductName, requireProductPrice } = require('./validator');
const { getOneBy } = require('../../repositories/users');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// route for Admin product list
router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsToRender({ products }));
});

// route for Admin product creation
router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(newProductTemplate({}));
});

// router to handle post request for product submission.
router.post(
  '/admin/products/new',
  requireAuth,
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

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id);
  if (!product) {
    return res.send('Product not found');
  }

  res.send(productEditTemplate({ product }));
});

router.post(
  '/admin/products/:id/edit',
  requireAuth,
  upload.single('image'),
  [requireProductName, requireProductPrice],
  handleErrors(productEditTemplate, async (req) => {
    const product = await productsRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;

    if (req.file) {
      changes.image = req.file.buffer.toString('base64');
    }

    try {
      await productsRepo.update(req.params.id, changes);
    } catch (error) {
      return res.send('Product not found');
    }
    res.redirect('/admin/products');
  }
);

router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
  await productsRepo.delete(req.params.id);
  res.redirect('/admin/products');
});

module.exports = router;
