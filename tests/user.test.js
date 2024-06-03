const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../dao/models/user');

chai.use(chaiHttp);
const { expect } = chai;

describe('User Routes', () => {
    let userId;

    before(async () => {
        // Conectar a la base de datos
        await mongoose.connect('mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Crear un usuario de prueba
        const user = new User({
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            age: 30,
            password: 'password123',
            documents: [
                { name: 'Identificación', reference: 'path/to/id' },
                { name: 'Comprobante de domicilio', reference: 'path/to/address' }
            ]
        });
        const savedUser = await user.save();
        userId = savedUser._id;
    });

    after(async () => {
        // Eliminar el usuario de prueba y cerrar la conexión
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    it('should upload documents for a user', (done) => {
        chai.request(app)
            .post(`/api/users/${userId}/documents`)
            .attach('documents', 'tests/files/sample-document.txt', 'sample-document.txt')
            .attach('documents', 'tests/files/sample-document2.txt', 'sample-document2.txt')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('documents');
                expect(res.body.documents).to.be.an('array').that.is.not.empty;
                done();
            });
    });

    it('should update user role to premium', (done) => {
        chai.request(app)
            .put(`/api/users/premium/${userId}`)
            .send({ role: 'premium' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').eql('Rol de usuario actualizado correctamente');
                done();
            });
    });

    it('should not update user role to premium if documents are missing', (done) => {
        const newUser = new User({
            first_name: 'New',
            last_name: 'User',
            email: 'newuser@example.com',
            age: 25,
            password: 'password123'
        });

        newUser.save().then(savedUser => {
            chai.request(app)
                .put(`/api/users/premium/${savedUser._id}`)
                .send({ role: 'premium' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message').eql('El usuario no ha terminado de procesar su documentación');
                    done();
                });
        });
    });
});