const path = require('path');

function getAdminUserView(req, res) {
    res.sendFile(path.join(__dirname, '../views/admin/users.html'));
}

module.exports = {
    getAdminUserView
};