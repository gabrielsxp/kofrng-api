const express = require('express');
const router = new express.Router();
const auth = require('../Middleware/auth');
const admin = require('../Middleware/admin');   
const FighterController = require('../Controller/FighterController');
const UserController = require('../Controller/UserController');
const RNGController = require('../Controller/RNGController');
const PoolController = require('../Controller/PoolController');
const BannerController = require('../Controller/BannerController');
const DefaultPoolController = require('../Controller/DefaultPoolController');

//User End-Points
router.post('/createUser', UserController.signUp);
router.post('/signIn', UserController.signIn);
router.patch('/updateUser/:id', auth, UserController.update);
router.delete('/deleteUser/:id', admin, UserController.delete);

//Fighter End-Points
router.post('/createFighter', admin, FighterController.createFighter);
router.get('/fighters', FighterController.index);
router.get('/fighters?year=:year', auth, FighterController.filterByYear);
router.get('/fighters?color=:color', auth, FighterController.filterByColor);
router.get('/fighters?type=:type', auth, FighterController.filterByType);

//Gacha End-Points
router.get('/randomFighter/:bannerId', RNGController.single);
router.get('/multiFighters/:bannerId', RNGController.multi);

//Pool End-Points
router.post('/createPool', auth, PoolController.createPool);
router.post('/redefinePool/:id', auth, PoolController.redefinePool);
router.get('/pool/:id', PoolController.getPool);

//Default Pool End-Points
router.post('/createDefaultPool', admin, DefaultPoolController.createDefaultPool);
router.get('/getDefaultPool/:id', DefaultPoolController.getDefaultPool);
router.patch('/updateDefaultPool/:id', admin, DefaultPoolController.updateDefaultPool);
router.delete('/deleteDefaultPool/:id', admin, DefaultPoolController.deleteDefaultPool);

//Banner End-Points
router.post('/createBanner', auth, BannerController.createBanner);
router.get('/banners', BannerController.index);
router.get('/banners/:id', BannerController.getBanner);
router.get('/banners/slug/:slug', BannerController.getBySlug);
router.patch('/updateBanner/:id', auth, BannerController.updateBanner);
router.delete('/deleteBanner/:id', auth, BannerController.deleteBanner);

module.exports = router;