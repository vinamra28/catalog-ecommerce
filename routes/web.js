let express = require('express');
let router = express.Router();
let Admin = require('../controllers/webAdmin');

router.get('/', async (req, res) => {
  if(req.session.user) {
    res.redirect('/web/dashboard');
  } else {
    res.render('login');
  }
});
router.get('/login', async (req, res) => {
  if(req.session.user) {
    res.redirect('/web/dashboard');
  } else {
    res.render('login');
  }
});

router.post('/login', async (req, res) => {
  let response = await Admin.login(req.body.email, req.body.password);
  if(response) {
    req.session.user = req.body.email;
    res.redirect('/web/dashboard');
  } else {
    res.redirect('/web/login');
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.render('login');
});

router.get('/dashboard', async (req, res) => {
  if(req.session.user) {
    let response = await Admin.getStats();
    res.render('dashboard', {
      'stats': response
    });
  } else {
    res.redirect('/web/dashboard');
  }
});

router.get('/users', async (req, res) => {
  if(req.session.user) {
    let users = await Admin.getUsers();
    res.render('users', {
      'users': users
    });
  } else {
    res.redirect('/web/login');
  }
});

router.get('/adduser', async (req, res) => {
  if(req.session.user) {
    let users = await Admin.getUsers();
    res.render('adduser', {
      'users': users
    });
  } else {
    res.redirect('/web/login');
  }
});

router.post('/adduser', async (req, res) => {
  if(req.session.user) {
    let users = await Admin.addUser(req.body);
    if(users){
      res.redirect('/web/users');
    }
  } else {
    res.redirect('/web/login');
  }
});

// router.get('/events', async (req, res) => {
//   if(req.session.user) {
//     let events = await Admin.getEvents();
//     res.render('events', {
//       'events': events
//     });
//   } else {
//     res.redirect('/web/login');
//   }
// });

// router.get('/category', async (req, res) => {
//   if(req.session.user) {
//     let category = await Admin.getCategory();
//     res.render('category', {
//       'category': category
//     });
//   } else {
//     res.redirect('/web/login');
//   }
// });

// router.get('/sub-category', async (req, res) => {
//   if(req.session.user) {
//     let category = await Admin.getSubCategory();
//     console.log(category)
//     res.render('sub-category', {
//       'category': category
//     });
//   } else {
//     res.redirect('/web/login');
//   }
// });

// module.exports = router;
// let express = require('express');
// let router = express.Router();
// let Admin = require('../controllers/adminController');

// router.get('/login', async (req, res) => {
//   if(req.session.user) {
//     res.redirect('/web/dashboard');
//   } else {
//     res.render('login');
//   }
// });

// router.post('/login', async (req, res) => {
//   let response = await Admin.login(req.body.email, req.body.password);
//   if(response) {
//     req.session.user = req.body.email;
//     res.redirect('/web/dashboard');
//   } else {
//     res.redirect('/web/login');
//   }
// });

// router.get('/logout', async (req, res) => {
//   req.session.destroy();
//   res.render('login');
// });

// router.get('/dashboard', async (req, res) => {
//   if(req.session.user) {
//     let response = await Admin.getStats();
//     res.render('dashboard', {
//       'stats': response
//     });
//   } else {
//     res.redirect('/web/login');
//   }
// });

// router.get('/users', async (req, res) => {
//   if(req.session.user) {
//     let users = await Admin.getUsers();
//     res.render('users', {
//       'users': users
//     });
//   } else {
//     res.redirect('/web/login');
//   }
// });

// router.get('/events', async (req, res) => {
//   if(req.session.user) {
//     let events = await Admin.getEvents();
//     res.render('events', {
//       'events': events
//     });
//   } else {
//     res.redirect('/web/login');
//   }
// });

// router.get('/category', async (req, res) => {
//   if(req.session.user) {
//     let category = await Admin.getCategory();
//     res.render('category', {
//       'category': category
//     });
//   } else {
//     res.redirect('/web/login');
//   }
// });

// router.get('/sub-category', async (req, res) => {
//   if(req.session.user) {
//     let category = await Admin.getSubCategory();
//     console.log(category)
//     res.render('sub-category', {
//       'category': category
//     });
//   } else {
//     res.redirect('/web/login');
//   }
// });

module.exports = router;
