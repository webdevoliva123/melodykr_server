const ARTICLE = require("../../models/article_model/Article");
const CONTENT_WRITER = require("../../models/content_writer_model/Content_Writers");
const moment = require("moment");
const { returnError } = require("../../utils/global");

exports.getArticle = async (req, res) => {
  try {
    const article_id = req?.params?.article_id;

    // article info
    const findArticle = await ARTICLE.findById(article_id);

    if (findArticle) {
      await ARTICLE.findOneAndUpdate({_id : article_id }, {views : findArticle?.views + 1})
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
    } else {
      const latest_article = "_id thumbnail title category createdAt";
      const findlatestArticle = await ARTICLE?.find()
        .select(latest_article)
        .sort({ createdAt: -1 })
        .limit(12);
        return returnError(res,404,"We couldn't find any articles by this id. Don't worry, Explore latest articles.",error?.message,findlatestArticle)
      
    }
  } catch (error) {
    const latest_article = "_id thumbnail title category createdAt";
    const findlatestArticle = await ARTICLE?.find()
      .select(latest_article)
      .sort({ createdAt: -1 })
      .limit(12);
    return res.status(500).json({
      success: false,
      message:
        "We couldn't find any articles by this id. Don't worry, Explore latest articles.",
      error: error?.message,
      data: findlatestArticle,
    });
  }
};

exports.getHomeTrendingArticles = async (req, res) => {
  try {
    const thirtyDaysAgo = moment().subtract(30, "days").toDate();

    const trendingArticles = await ARTICLE.find({
      createdAt: { $gte: thirtyDaysAgo },
    })
      .sort({ views: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      message: "Trending articles retrieved successfully!",
      data: trendingArticles,
    });
  } catch (error) {
   

    return returnError(res,500,"Something went wrong while fetching trending articles.",error?.message)
  }
};

exports.getHomeLatestArticles = async (req, res) => {
  try {
    const latestArticle = await ARTICLE.find()
      .sort({ createdAt: -1 })
      .limit(12);

    return res.status(200).json({
      success: true,
      message: "Lastest articles retrieved successfully!",
      data: latestArticle,
    });
  } catch (error) {
    
    return returnError(res,500,"Something went wrong while fetching latest articles.",error?.message)

   
  }
};

exports.getHomeThisWeekSpotlight = async (req, res) => {
  try {
    const spotlight = (await req?.params?.spotlight_type) || 1;
    const thirtyDaysAgo = moment().subtract(360, "days").toDate();

    if (spotlight == 1) {
      const spotligthArticles = await ARTICLE.find({
        createdAt: { $gte: thirtyDaysAgo },
      })
        .sort({ createdAt: -1 })
        .limit(6);

      return res.status(200).json({
        success: true,
        message: "Recent Spotlight articles retrieved successfully!",
        data: spotligthArticles,
      });
    } else if (spotlight == 2) {
      const spotligthArticles = await ARTICLE.find({
        createdAt: { $gte: thirtyDaysAgo },
      })
        .sort({ views: -1 })
        .limit(6);

      return res.status(200).json({
        success: true,
        message: "Popular Spotlight articles retrieved successfully!",
        data: spotligthArticles,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Something went wrong, didn't get spotlight type.",
      });
    }
  } catch (error) {
    return returnError(res,500,"Something went wrong while fetching spotligth articles.",error?.message)
    
  }
};

exports.getHomeViedosArticle = async (req, res) => {
  try {
    const videosArticle = await ARTICLE.find({
      isVideoInclude: true,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    return res.status(200).json({
      success: true,
      message: "Videos articles retrieved successfully!",
      data: videosArticle,
    });
  } catch (error) {
    return returnError(res,500,"Something went wrong while fetching videos articles.",error?.message)
    
  }
};

exports.getHomePickOneArticle = async (req, res) => {
  try {
    const pickedArtilce = await ARTICLE.find({
      isHeadline: true,
    })
      .sort({ createdAt: -1 })
      .limit(4);

    return res.status(200).json({
      success: true,
      message: "Picked One articles retrieved successfully!",
      data: pickedArtilce,
    });
  } catch (error) {
    return returnError(res,500,"Something went wrong while fetching picked one articles.",error?.message)
    
  }
};

exports.getHomeAllCategoryArticle = async (req, res) => {
  try {
    const videosArticles = await ARTICLE.find({
      isVideoInclude: true,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    const styleArticles = await ARTICLE.find({
      category: "STYLE",
    })
      .sort({ createdAt: -1 })
      .limit(3);

    const tv_filmArticles = await ARTICLE.find({
      category: "TV/FILM",
    })
      .sort({ createdAt: -1 })
      .limit(3);

    const featuresArticles = await ARTICLE.find({
      category: "FEATURES",
    })
      .sort({ createdAt: -1 })
      .limit(3);

    return res.status(200).json({
      success: true,
      message: "Categories articles retrieved successfully!",
      data: {
        videos: videosArticles,
        style: styleArticles,
        tv_film: tv_filmArticles,
        features: featuresArticles,
      },
    });
  } catch (error) {
    return returnError(res,500,"Something went wrong while fetching all category articles.",error?.message)
    
  }
};

exports.getArticleByCategory = async (req, res) => {
  try {
    const category = req?.params?.cat_id;

    // 1 - Videos
    // 2 - Style
    // 3 - Drama
    // 4 - Music
    // 5 -  Features

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong while fetching all category articles.",
        error: `Please, provide a valid category id.`,
      });
    }

    switch (category) {
      case "1":
        const vdieoArticles = await ARTICLE.find({
          isVideoInclude: true,
        }).sort({
          createdAt: -1,
        });

        return res.status(200).json({
          success: true,
          message: "Categories articles retrieved successfully!",
          data: vdieoArticles,
        });

      case "2":
        const styleArticles = await ARTICLE.find({ category: "STYLE" })?.sort({
          createdAt: -1,
        });
        return res.status(200).json({
          success: true,
          message: "Categories articles retrieved successfully!",
          data: styleArticles,
        });
      case "3":
        const dramaArticles = await ARTICLE.find({ category: "TV/FILM" })?.sort(
          {
            createdAt: -1,
          }
        );
        return res.status(200).json({
          success: true,
          message: "Categories articles retrieved successfully!",
          data: dramaArticles,
        });
      case "4":
        const musicArticles = await ARTICLE.find({ category: "MUSIC" })?.sort({
          createdAt: -1,
        });
        return res.status(200).json({
          success: true,
          message: "Categories articles retrieved successfully!",
          data: musicArticles,
        });
      case "5":
        const featuresArticles = await ARTICLE.find({
          category: "FEATURES",
        })?.sort({
          createdAt: -1,
        });
        return res.status(200).json({
          success: true,
          message: "Categories articles retrieved successfully!",
          data: featuresArticles,
        });
    }
  } catch (error) {
    return returnError(res,500,"Something went wrong while fetching all category articles.",error?.message)
    
  }
};

exports.getArticleAuthor = async (req, res) => {
  try {
    const auhtor = req?.params?.author_id;

    if (!auhtor) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong while fetching all category articles.",
        error: `Please, provide a valid category id.`,
      });
    }

    const articleAuthor = await CONTENT_WRITER.findById(auhtor);
    if (articleAuthor) {
      const { password, ...authorDetails } = articleAuthor?._doc;

      return res.status(200).json({
        success: true,
        message: "Categories articles retrieved successfully!",
        data: authorDetails,
      });
    } else {
      const authors = "_id profileImage name email socialMedia articles";
      const findAllAuthors = await CONTENT_WRITER?.find()
        .select(authors)
        .sort({ createdAt: -1 })
        .limit(12);
      return res.status(404).json({
        sucess: false,
        message:
          "We couldn't find any account by this id. Don't worry, Explore other popular content writers.",
        data: findAllAuthors,
      });
    }
  } catch (error) {
    const authors = "_id profileImage name email socialMedia articles";
    const findAllAuthors = await CONTENT_WRITER?.find()
      .select(authors)
      .sort({ createdAt: -1 })
      .limit(12);
      return returnError(res,404,"We couldn't find any account by this id. Don't worry, Explore other popular content writers.",error?.message,findAllAuthors)
   
  }
};
