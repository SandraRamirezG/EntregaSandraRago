import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';  // Asegúrate de que la ruta sea correcta

chai.use(chaiHttp);
const { expect, request } = chai;

export { expect, request, app };
