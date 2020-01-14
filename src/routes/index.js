const express = require('express');
const router = new express.Router();
const auth = require('../Middleware/auth');
const admin = require('../Middleware/admin');   
const FighterController = require('../Controller/FighterController');
const UserController = require('../Controller/UserController');
const SummonController = require('../Controller/SummonController');
const BestSummonController = require('../Controller/BestSummonController');
const BannerController = require('../Controller/BannerController');
const DefaultPoolController = require('../Controller/DefaultPoolController');
const GlobalStatisticsController = require('../Controller/GlobalStatisticsController');
const FighterCollectionController = require('../Controller/FighterCollectionController');
const FavouritesController = require('../Controller/FavouritesController');
const TierListController = require('../Controller/TierListController');

//User End-Points
router.post('/signup', UserController.signUp);
router.post('/signin', UserController.signIn);
router.post('/check/user', UserController.validUsername);
router.post('/check/email', UserController.validUsername);
router.patch('/user/password', auth, UserController.changePassword);
router.patch('/user/:id', auth, UserController.update);
router.delete('/user/:id', admin, UserController.delete);

//Fighter End-Points
router.post('/fighter', admin, FighterController.createFighter);
router.get('/fighters', FighterController.index);
router.get('/fighters/filter', auth, FighterController.filter);

//Gacha End-Points
router.get('/gacha/fighter/:bannerId', SummonController.makeSingleSummon);
router.get('/gacha/fighters/:bannerId', SummonController.makeMultiSummon);
router.get('/gacha/signed/fighter/:bannerId', auth, SummonController.makeSingleSummon);
router.get('/gacha/signed/fighters/:bannerId', auth, SummonController.makeMultiSummon);

//Default Pool End-Points
router.post('/defaultPool', auth, DefaultPoolController.createDefaultPool);
router.get('/defaultPool', auth, DefaultPoolController.indexOfUser);
router.patch('/defaultPool/:id', auth, DefaultPoolController.updateDefaultPool);
router.delete('/defaultPool/:id', auth, DefaultPoolController.deleteDefaultPool);
router.get('/defaultPool/:id', DefaultPoolController.getDefaultPool);

//Summon End-Points
router.get('/summon/:id', SummonController.getSummon);
router.get('/luckiest/summon', BestSummonController.getBestSummon);
router.get('/top/summons', SummonController.getTopSummons);

//Banner End-Points
router.post('/banner', auth, BannerController.createBanner);
router.get('/banners/fans', BannerController.fanBanners);
router.post('/banners/fans/filter', BannerController.getByName);
router.get('/all/banners', BannerController.index);
router.get('/all/admin/banners', BannerController.adminIndex);
router.get('/banners', auth, BannerController.indexOfUser);
router.get('/banners/slug/:slug', BannerController.getBySlug);
router.patch('/banner/:id', auth, BannerController.updateBanner);
router.delete('/banner/:id', auth, BannerController.deleteBanner);
router.get('/banners/:id', BannerController.getBanner);
router.get('/banners/filter/:date', BannerController.filterByDate);

//Stats Routes
router.post('/stats', admin, GlobalStatisticsController.createGlobalStats);
router.get('/stats/rubies', auth, GlobalStatisticsController.getDetailedRubiesStats);
router.get('/stats/fighters', auth, GlobalStatisticsController.getDetailedFightersStats);
router.get('/global/stats', GlobalStatisticsController.getAllStats);

//Fighter Collection End-points
router.post('/fighterCollection', auth, FighterCollectionController.insertFighter);
router.get('/fighterCollection/:id', auth, FighterCollectionController.getCollection);

//Favourites End-Points
router.post('/favourites/:summonId', auth, FavouritesController.insertSummon);
router.delete('/favourites/:summonId', auth, FavouritesController.removeSummon);
router.get('/favourites', auth, FavouritesController.getFavourites);

//TierList End-Points
router.post('/tierlist', TierListController.createTierList);
router.get('/tierlist/:id', TierListController.getTierList);
router.get('/tierlists', TierListController.getListOfTierLists);

module.exports = router;