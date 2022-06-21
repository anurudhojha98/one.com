const ProductController = require('../controllers/ProductController');
const { isAuthenticated } = require('../middlewares/middleware')

class ProductRoutes {
  constructor() {
  }
  loadRoutes(app) {
    app.post('/products', isAuthenticated, (req, res) => {
      this.productCtrl = new ProductController();
      this.productCtrl.createdProduct(req, res)
    });
    app.patch('/products', isAuthenticated, (req, res) => {
      this.productCtrl = new ProductController();
      this.productCtrl.updateProduct(req, res)
    });

    app.put('/products', isAuthenticated, (req, res) => {
      this.productCtrl = new ProductController();
      this.productCtrl.updateProduct(req, res)
    });

    app.get('/products', isAuthenticated, (req, res) => {
      this.productCtrl = new ProductController();
      this.productCtrl.getProductList(req, res)
    });
    app.delete('/products/:product_id', isAuthenticated, (req, res) => {
      this.productCtrl = new ProductController();
      this.productCtrl.deleteProductById(req, res)
    });
  }
}

module.exports = ProductRoutes;