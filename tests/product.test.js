import { expect, request, app } from './testHelper';

describe('Product Routes', () => {
    it('should get all products', async () => {
        const res = await request(app).get('/api/products');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
    });

    it('should create a new product', async () => {
        const newProduct = {
            name: 'New Product',
            price: 10.99,
            description: 'A new product for testing',
            owner: 'admin'
        };
        const res = await request(app).post('/api/products').send(newProduct);
        expect(res).to.have.status(201);
        expect(res.body).to.include.keys('name', 'price', 'description', 'owner');
    });

    it('should not create a product with missing fields', async () => {
        const newProduct = {
            name: 'Incomplete Product',
            price: 10.99
        };
        const res = await request(app).post('/api/products').send(newProduct);
        expect(res).to.have.status(400);
    });
});