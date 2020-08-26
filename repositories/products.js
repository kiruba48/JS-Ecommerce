const Repository = require('./repository');

class productRepository extends Repository {}

module.exports = new productRepository('products.json');
