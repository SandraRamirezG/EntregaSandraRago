const User = require('../dao/models/user');

async function forgotPassword(req, res) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Aquí se enviara el correo con el enlace para restablecer la contraseña
        // lógica para enviar el correo con el enlace y token

        res.status(200).json({ message: 'Correo enviado para restablecer contraseña' });
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}

async function changeUserRole(req, res) {
    const { uid } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: 'Rol de usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
    }
}

module.exports = {
    forgotPassword,
    changeUserRole
};