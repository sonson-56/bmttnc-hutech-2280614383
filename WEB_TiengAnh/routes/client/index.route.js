
const homeRouterClient = require('./home.route.js');
module.exports = (app) =>{
    app.use('/', homeRouterClient);
}