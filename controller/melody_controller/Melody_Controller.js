const ARTICLE = require("../../models/article_model/Article");

exports.getMelodyHomeData = async (req,res) => {
    try {
        const contentForArticleHeadline = 'title thumbnail category createdAt';
        const articleHeadline = await ARTICLE.find({isHeadline:true}).select(contentForArticleHeadline).sort({ createdAt: -1 }).limit(10)
        const contentForLatestArticle= 'title thumbnail category author views createdAt';
        const latestArticle = await ARTICLE.find({isHeadline:false}).select(contentForLatestArticle).sort({ createdAt: -1 }).limit(7)
        return res.status(200).json({
            success : true,
            message: 'Home Data Loaded',
            data : {
                articleHeadline,
                latestArticle,
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error?.message,
          });
    }
}


