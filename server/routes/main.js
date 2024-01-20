const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

/**
 * GET /
 * HOME
*/
router.get('/', async (req, res) => {
  const token = req.cookies.token;
  const isLoggedIn = token ? true : false;

  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    // 设置 每页的 post 数量
    let perPage = 10;
    // 获取当前的page
    let page = req.query.page || 1;

    // 用于从Post集合中获取数据，进行降序排序，然后实现分页功能
    // 这在网站或应用中实现文章列表、博客帖子、论坛帖子等的分页显示时非常常见
    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    // 获取 Post 集合 中 文档数量
    const count = await Post.countDocuments({});
    // 获取下一页的 page
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      isLoggedIn: isLoggedIn,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  const token = req.cookies.token;
  const isLoggedIn = token ? true : false;

  try {
    let slug = req.params.id;

    // 根据 post id 获取 post
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      isLoggedIn: isLoggedIn,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  const token = req.cookies.token;
  const isLoggedIn = token ? true : false;

  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      isLoggedIn: isLoggedIn,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  const token = req.cookies.token;
  const isLoggedIn = token ? true : false;

  res.render('about', {
    isLoggedIn: isLoggedIn,
    currentRoute: '/about'
  });
});

router.get('/contact', (req, res) => {
  const token = req.cookies.token;
  const isLoggedIn = token ? true : false;
  
  res.render('contact', {
    isLoggedIn: isLoggedIn,
    currentRoute: '/contact'
  });
});


// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic."
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan."
//     },
//   ])
// }

// insertPostData();

module.exports = router;
