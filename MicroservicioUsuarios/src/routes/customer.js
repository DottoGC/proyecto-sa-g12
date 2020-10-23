const router = require('express').Router();
const passport = require('passport');

const customerController = require('../controllers/customerController');

router.get('/', customerController.list);
router.get('/login', customerController.login);
router.post('/login', (req, res, next) => {
    passport.authenticate('local.signin', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });
router.post('/add', customerController.save);
router.get('/update/:id', customerController.edit);
router.post('/update/:id', customerController.update);
router.get('/delete/:id', customerController.delete);

module.exports = router;


/*
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),function(req, res) {
    res.redirect('/');
  });*/