const User = require('../dao/models/user');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads/';
        if (file.fieldname === 'profile') folder = 'uploads/profiles';
        if (file.fieldname === 'product') folder = 'uploads/products';
        if (file.fieldname === 'document') folder = 'uploads/documents';
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

async function forgotPassword(req, res) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Aquí se enviará el correo con el enlace para restablecer la contraseña
        // lógica para enviar el correo con el enlace y token

        res.status(200).json({ message: 'Correo enviado para restablecer contraseña' });
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}

async function changeUserRole(req, res) {
    const { uid } = req.params;
    try {
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const requiredDocs = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
        const uploadedDocs = user.documents.map(doc => doc.name);
        const hasAllDocs = requiredDocs.every(doc => uploadedDocs.includes(doc));

        if (!hasAllDocs) {
            return res.status(400).json({ message: 'El usuario no ha terminado de procesar su documentación' });
        }

        user.role = 'premium';
        await user.save();

        res.status(200).json({ message: 'Rol de usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
    }
}

async function uploadDocuments(req, res) {
    const { uid } = req.params;

    try {
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const files = req.files.map(file => ({
            name: file.originalname,
            reference: file.path
        }));

        user.documents = user.documents.concat(files);
        await user.save();

        res.status(200).json({ message: 'Documentos subidos correctamente', documents: user.documents });
    } catch (error) {
        res.status(500).json({ error: 'Error al subir los documentos' });
    }
}

module.exports = {
    forgotPassword,
    changeUserRole,
    uploadDocuments
};