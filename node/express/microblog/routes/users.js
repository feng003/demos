var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/users/username/001',function(req,res){
    res.send('user: ' + req.params.username);
});

module.exports = router;
