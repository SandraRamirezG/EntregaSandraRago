const User = require('../dao/models/user');
const sendEmail = require('../utils/email');

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
// Obtener todos los usuarios
async function getAllUsers(req, res) {
    try {
        const users = await User.find({}, 'first_name last_name email role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
}

// Limpiar usuarios inactivos
async function cleanInactiveUsers(req, res) {
    try {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        const inactiveUsers = await User.find({ last_connection: { $lt: twoDaysAgo } });

        for (const user of inactiveUsers) {
            await sendEmail(user.email, 'Cuenta eliminada por inactividad', 'Tu cuenta ha sido eliminada por inactividad.');
            await User.deleteOne({ _id: user._id });
        }

        res.json({ message: 'Usuarios inactivos eliminados' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
    }
}

module.exports = {
    forgotPassword,
    changeUserRole,
    getAllUsers,
    cleanInactiveUsers
};