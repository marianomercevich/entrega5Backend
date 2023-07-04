import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import productsRouter from './routs/products.router.js';
import cartsRouter from './routs/carts.router.js';
import viewsRouter from './routs/views.router.js';

const app = express();
const httpServer = app.listen(8080, () => console.log('Server Up'));
const io = new Server(httpServer);

app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use(express.json());
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');
app.use(express.static('./src/public'));

app.get('/', (req, res) => res.render('index'));
app.use('/products', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

io.on('connection', socket => {
    console.log('new client connected');
    socket.on('productList', data => {
        io.emit('updateProducts', data);
    });
});