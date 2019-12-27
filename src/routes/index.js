const express = require('express');
const router = new express.Router();
const auth = require('../Middleware/auth');
const admin = require('../Middleware/admin');
const FighterController = require('../Controller/FighterController');
const UserController = require('../Controller/UserController');
const RNGController = require('../Controller/RNGController');

//User End-Points
router.post('/createUser', UserController.signUp);
router.post('/signIn', UserController.signIn);
router.patch('/updateUser/:id', auth, UserController.update);
router.delete('/deleteUser/:id', admin, UserController.delete);

//Fighter End-Points
router.post('/createFighter', admin, FighterController.createFighter);
router.get('/fighters', auth, FighterController.index);
router.get('/fighters?year=:year', auth, FighterController.filterByYear);
router.get('/fighters?color=:color', auth, FighterController.filterByColor);
router.get('/fighters?type=:type', auth, FighterController.filterByType);

//Gacha End-Points
router.get('/randomFighter', RNGController.single);

module.exports = router;