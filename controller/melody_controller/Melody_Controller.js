const ARTICLE = require("../../models/article_model/Article");

exports.getMelodyHomeData = async (req,res) => {
    try {
        const fieldsToRetrieve = 'title thumbnail category createdAt';
        const articleHeadline = await ARTICLE.find({isHeadline:true}).select(fieldsToRetrieve).sort({ createdAt: -1 }).limit(10)
        return res.status(200).json({
            success : true,
            message: 'Home Data Loaded',
            data : {
                articleHeadline
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


