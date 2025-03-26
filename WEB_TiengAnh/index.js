const express = require('express');
const mongoose = require('mongoose');
const database = require('./config/database');

database.connectDB();

const app = express();
const port = 10000;

const routerClient  = require('./routes/client/index.route');
const routerAdmin = require('./routes/admin/index.route');
routerClient(app); 
routerAdmin(app);
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

// app.use('/client', routerClient);
// app.use('/admin', routerAdmin);

app.listen(port, () => {
    console.log('Server đã kết nối đến cổng:', port, 'thành công');
});
