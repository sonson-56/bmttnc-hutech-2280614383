
const dashboardRouterAdmin = require('./dashboard.route.js');
const readingTOEICRouter = require('./CRUD_readingTOEIC.route.js');
module.exports = (app) =>{
    app.use('/admin', dashboardRouterAdmin);
    app.use('/admin', readingTOEICRouter);
}