import { expect, request, app } from './testHelper';

describe('Session Routes', () => {
    it('should log in a user', async () => {
        const credentials = {
            email: 'testuser@example.com',
            password: 'password123'
        };
        const res = await request(app).post('/api/sessions/login').send(credentials);
        expect(res).to.have.status(200);
        expect(res.body).to.include.keys('token');
    });

    it('should not log in a user with incorrect password', async () => {
        const credentials = {
            email: 'testuser@example.com',
            password: 'wrongpassword'
        };
        const res = await request(app).post('/api/sessions/login').send(credentials);
        expect(res).to.have.status(401);
    });

    it('should log out a user', async () => {
        const res = await request(app).post('/api/sessions/logout');
        expect(res).to.have.status(200);
    });
});