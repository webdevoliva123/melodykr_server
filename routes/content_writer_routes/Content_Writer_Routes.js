const express = require("express");
const { loginContentWriter, createArticleByContentWriter, updatedArticleByContentWriter, deleteArticleByContentWriter, getContentWriterInfo, getContentWriterArticle } = require("../../controller/content_writer_controller/Content_Writer_Controller");
const { contentWriterLoginAuthentication } = require("../../middleware/authentication_middleware");
const router = express.Router();

// 1. login content_writer
// 2. get content writer info
// 3. get content all articles
// 4. create new article
// 5. update article
// 6. delete article

// ----------------------------------------------------------------

// login
router.post('/content_writer/login', loginContentWriter)

// content writer info
router.get('/content_writer/info/:_id',getContentWriterInfo)

// content articles info
router.get('/content_writer/articles/:_id',getContentWriterArticle)

// new articles
router.post('/content_writer/new/article',contentWriterLoginAuthentication,createArticleByContentWriter)

// update articles
router.put('/content_writer/update/article/:_id',contentWriterLoginAuthentication,updatedArticleByContentWriter)

// delete articles
router.delete('/content_writer/delete/article/:_id',contentWriterLoginAuthentication,deleteArticleByContentWriter)

module.exports = router;
