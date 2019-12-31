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
router.post('/signout', UserController.signUp);
router.post('/signin', UserController.signIn);
router.patch('/user/:id', auth, UserController.update);
router.delete('/user/:id', admin, UserController.delete);

//Fighter End-Points
router.post('/fighter', admin, FighterController.createFighter);
router.get('/fighters', FighterController.index);
router.get('/fighters?year=:year', auth, FighterController.filterByYear);
router.get('/fighters?color=:color', auth, FighterController.filterByColor);
router.get('/fighters?type=:type', auth, FighterController.filterByType);

//Gacha End-Points
router.get('/gacha/fighter/:bannerId', RNGController.single);
router.get('/gacha/fighter/:bannerId', RNGController.multi);

//Pool End-Points
router.post('/pool', auth, PoolController.createPool);
router.post('/pool/:id', auth, PoolController.redefinePool);
router.get('/pool/:id', PoolController.getPool);

//Default Pool End-Points
router.post('/defaultPool', admin, DefaultPoolController.createDefaultPool);
router.get('/defaultPool/:id', DefaultPoolController.getDefaultPool);
router.patch('/defaultPool/:id', admin, DefaultPoolController.updateDefaultPool);
router.delete('/defaultPool/:id', admin, DefaultPoolController.deleteDefaultPool);

//Banner End-Points
router.post('/createBanner', auth, BannerController.createBanner);
router.get('/banners', BannerController.index);
router.get('/banners/:id', BannerController.getBanner);
router.get('/banners/slug/:slug', BannerController.getBySlug);
router.patch('/updateBanner/:id', auth, BannerController.updateBanner);
router.delete('/deleteBanner/:id', auth, BannerController.deleteBanner);

module.exports = router;