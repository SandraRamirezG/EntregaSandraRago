import { expect, request, app } from './testHelper';

describe('Cart Routes', () => {
    it('should get all carts', async () => {
        const res = await request(app).get('/api/carts');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
    });

    it('should add a product to the cart', async () => {
        const productId = 'someProductId';
        const res = await request(app).post('/api/carts/add').send({ productId });
        expect(res).to.have.status(200);
        expect(res.body).to.include.keys('products');
    });

    it('should not add a product to the cart if productId is missing', async () => {
        const res = await request(app).post('/api/carts/add').send({});
        expect(res).to.have.status(400);
    });
});