class ProductController {
    constructor() { }
    createdProduct(req, res) {
        try {
            return res.status(201).json(
                {
                    success: true,
                    message: "Product added successfully"
                }
            );
        } catch (err) {
            return res.status(500).json(
                {
                    success: false,
                    message: err.message
                }
            );
        }
    }

    updateProduct(req, res) {
        try {
            return res.status(200).json(
                {
                    success: true,
                    message: "Product updated successfully"
                }
            )
        } catch (err) {
            return res.status(500).json(
                {
                    success: false,
                    message: err.message
                }
            );
        }
    }

    getProductList(req, res) {
        try {
            return res.status(200).json(
                {
                    success: true,
                    message: "Product sent successfully"
                }
            )
        } catch (err) {
            return res.status(500).json(
                {
                    success: false,
                    message: err.message
                }
            );
        }
    }

    deleteProductById(req, res) {
        try {
            return res.status(200).json(
                {
                    success: true,
                    message: "Product deleted successfully"
                }
            )
        } catch (err) {
            return res.status(500).json(
                {
                    success: false,
                    message: err.message
                }
            );
        }

    }
}

module.exports = ProductController;