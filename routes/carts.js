const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartTemplate = require('../HTMLview/carts/cartsTemp');

const router = express.Router();

// POST request to add an item to the cart
router.post('/cart/products', async (req, res) => {
  //  if we don't have a cart, create one by checking the cartID
  let cart;
  if (!req.session.cartId) {
    // create cart
    cart = await cartsRepo.create({ items: [] });
    // store cart id on req.session.cardId
    req.session.cartId = cart.ID;
  } else {
    //   we have a cart, get it from repository.
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  //   add a new product to items array or increase the quantity of the item if already exists
  const existingItem = cart.items.find(
    (item) => item.ID === req.body.productID
  );
  if (existingItem) {
    //   increase the quantity
    existingItem.quantity++;
  } else {
    //   add a new product id to items array
    cart.items.push({ ID: req.body.productID, quantity: 1 });
  }

  await cartsRepo.update(cart.ID, {
    items: cart.items,
  });
  console.log(cart);
  res.send('Product added to cart');
});

// GET request to show all the items of the cart
router.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect('/');
  }

  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.ID);
    item.product = product;
  }
  res.send(cartTemplate({ items: cart.items }));
});

// POST request to delete a product in cart
router.post('/cart/products/delete', async (req, res) => {
  const { itemId } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);

  //   filtering the cart by comparing the itemId
  const items = cart.items.filter((item) => item.ID !== itemId);

  //   update the cart using the filtered products
  await cartsRepo.update(req.session.cartId, { items });

  res.redirect('/cart');
});
module.exports = router;
