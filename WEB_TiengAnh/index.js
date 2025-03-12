const express = require('express');
const app = express();
const port = 10000;


const routerClient  = require('./routes/client/index.route');
app.set('view engine', './views');


app.set('view engine', 'pug');
app.use(express.static('public'));

routerClient(app);




app.listen(port,(req,res)=>{
    console.log('Server đã kết nối đến cổng:',port, 'thành công');
});