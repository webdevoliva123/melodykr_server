const express = require("express");
const { getArticle } = require("../../controller/articles_controller/articles_controller");
const router = express.Router();

// 1.Get Article By Id

// ----------------------------------------------------------------

// get article by id
router.get('/article/:article_id', getArticle)



module.exports = router;
