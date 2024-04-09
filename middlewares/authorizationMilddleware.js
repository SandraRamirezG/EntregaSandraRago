// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    // Aquí la lógica para verificar si el usuario es administrador
    
    if (req.user && req.user.role === 'admin') { 
        // Si el usuario es administrador, pasamos al siguiente middleware
        next();
    } else {
        // Si el usuario no es administrador, devolvemos un error de acceso no autorizado
        res.status(403).json({ error: 'Acceso no autorizado' });
    }
};

// Middleware para verificar si el usuario es usuario normal
const isUser = (req, res, next) => {
    // Aquí la lógica para verificar si el usuario es usuario normal
    if (req.user && req.user.role === 'user') { // Suponiendo que el rol de usuario normal se almacena en el objeto de usuario como 'user'
        // Si el usuario es usuario normal, pasamos al siguiente middleware
        next();
    } else {
        // Si el usuario no es usuario normal, devolvemos un error de acceso no autorizado
        res.status(403).json({ error: 'Acceso no autorizado' });
    }
};

module.exports = { isAdmin, isUser };
