
const dashboardRouterAdmin = require('./dashboard.route.js');
module.exports = (app) =>{
    app.use('/admin', dashboardRouterAdmin);
}