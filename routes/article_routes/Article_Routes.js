const express = require("express");
const { getArticle, getHomeTrendingArticles, getHomeLatestArticles, getHomeThisWeekSpotlight, getHomeViedosArticle, getHomeAllCategoryArticle, getHomePickOneArticle, getArticleByCategory, getArticleAuthor } = require("../../controller/articles_controller/Articles_Controller");
const router = express.Router();

// 1. Get Article By Id
// 2. Get Trending Articles
// 3. Get Latest Articles
// 4. Get Spotlight Article
// 5. Get Home Videos
// 6. Get Picked One Article
// 7. Get All Categories Article
// 8. Get Article By Category
// ----------------------------------------------------------------

// get article by id
router.get('/article/:article_id', getArticle)
router.get('/article/home/trendings',getHomeTrendingArticles)
router.get('/article/home/latest',getHomeLatestArticles)
router.get('/article/home/spotlight/:spotlight_type',getHomeThisWeekSpotlight)
router.get('/article/home/videos',getHomeViedosArticle)
router.get('/article/home/pick_one',getHomePickOneArticle)
router.get('/article/home/allCategory',getHomeAllCategoryArticle)
router.get('/article/category/:cat_id',getArticleByCategory)
router.get('/article/author/:author_id',getArticleAuthor)



module.exports = router;
