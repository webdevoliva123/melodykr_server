const ARTICLE = require("../../models/article_model/Article");
const CONTENT_WRITER = require("../../models/content_writer_model/Content_Writers");

exports.getArticle = async (req, res) => {
  try {
    const article_id = req.params.article_id;

    // article info
    const findArticle = await ARTICLE.findById(article_id);
    
    if(findArticle){
       const { author, ...otherData } = findArticle?._doc;

     // article author info
     const authordata = "_id socialMedia profileImage name email bio";
     const findAuthor = await CONTENT_WRITER?.findById(author?._id)?.select(
       authordata
     );
 
     // upcomming article
     const upcommingarticledata = "_id thumbnail title category createdAt";
     const findNextArticle = await ARTICLE?.find({
       createdAt: { $gt: otherData?.createdAt },
     })
       .select(upcommingarticledata)
       .limit(1);
     const findPrevArticle = await ARTICLE?.find({
       createdAt: { $lt: otherData?.createdAt },
     })
       .select(upcommingarticledata)
       .limit(1);
     const findRelatedArticle = await ARTICLE?.find({
       category: otherData?.category,
     })
       .select(upcommingarticledata)
       .sort({ createdAt: -1 })
       .limit(3);
 
     return res.status(200).json({
       success: true,
       message: "Article has been found!",
       data: {
         ...otherData,
         author: findAuthor,
         upcomming_article: {
           next_article: findNextArticle,
           prev_article: findPrevArticle,
         },
         related_article: findRelatedArticle,
       },
     });
   }else{
    const latest_article = "_id thumbnail title category createdAt";
    const findlatestArticle = await ARTICLE?.find()
        .select(latest_article)
        .sort({ createdAt: -1 })
        .limit(10);
    return res.status(404).json({
        sucess : false,
        error : "We couldn't find any articles by this id. Don't worry, Explore latest articles.",
        data : findlatestArticle

    })
   }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};
