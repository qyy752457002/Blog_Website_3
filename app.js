require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');

const app = express();
const PORT = process.env.PORT || 3000;
  
// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

/*
HTTP 方法扩展: 在HTML表单中，只能直接使用 GET 和 POST 方法

method-override 中间件允许您使用 HTML 表单中不支持的 HTTP 动词（如 PUT, DELETE），
这对于符合 REST 架构风格的应用来说很有用
*/
app.use(methodOverride('_method'));

app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//  this line of code is making isActiveRoute available to all views in the application by adding it to the app.locals object
app.locals.isActiveRoute = isActiveRoute; 

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, ()=> {
  console.log(`App listening on port ${PORT}`);
});
