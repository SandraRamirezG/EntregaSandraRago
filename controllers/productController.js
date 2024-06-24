const Product = require('../dao/models/product');
const User = require('../dao/models/user');
const sendEmail = require('../utils/email');

async function deleteProduct(req, res) {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (product.user) {
            const user = await User.findById(product.user);
            if (user.role === 'premium') {
                await sendEmail(user.email, 'Producto eliminado', 'Tu producto ha sido eliminado.');
            }
        }

        await Product.deleteOne({ _id: id });

        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}

module.exports = {
    deleteProduct
};