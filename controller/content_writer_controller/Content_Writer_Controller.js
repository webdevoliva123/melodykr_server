const ARTICLE = require("../../models/article_model/Article");
const CONTENT_WRITER = require("../../models/content_writer_model/Content_Writers");
const { decryptPassword } = require("../../utils/bycrypt");
const {
  requiredContentRegex,
  articleTitleMaxLengthRegex,
  validUrlRegex,
} = require("../../utils/regexList");
const {
  requiredValidationResponse,
} = require("../../utils/requiredValidation");
const { genrateJWTToken } = require("../../utils/tokens");

exports.loginContentWriter = async (req, res) => {
  try {
    const { email, password: userPlainPassword } = req.body;
    const findThisContentWriter = await CONTENT_WRITER.findOne({ email });

    if (!findThisContentWriter) {
      return res.status(400).json({
        success: false,
        message: "Error while logging",
        error:
          "Invalid admin email address or password, please re-check your credentials. ",
      });
    }

    const isPasswordCorrect = await decryptPassword(
      userPlainPassword,
      findThisContentWriter?.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Error while logging",
        error:
          "Invalid admin email address or password, please re-check your credentials. ",
      });
    }

    const { _id: idToEncrypt, email: emailToEncrypt } = findThisContentWriter;
    const { password: contentWriterEncryptPassword, ...otherData } =
      findThisContentWriter?._doc;

    return res.status(200).json({
      success: true,
      message: "You have been logged in successfully.",
      data: otherData,
      token: await genrateJWTToken({
        _id: idToEncrypt,
        email: emailToEncrypt,
      }),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

exports.getContentWriterInfo = async (req, res) => {
  try {
    const { _id: contentWriterId } = req.params;

    const findThisContentWriter = await CONTENT_WRITER.findById(
      contentWriterId
    );

    if (!findThisContentWriter) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong",
        error: "No Content Writer Found.",
      });
    }

    const { password, articles, ...otherData } = findThisContentWriter?._doc;

    return res.status(200).json({
      success: true,
      message: "Content Writer Found",
      data: otherData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

exports.getContentWriterArticle = async (req, res) => {
  try {
    const { _id: contentWriterId } = req.params;

    const findThisContentWriter = await CONTENT_WRITER.findById(
      contentWriterId
    );

    if (!findThisContentWriter) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong",
        error: "No Content Writer Found.",
      });
    }

    const { articles, ...otherData } = findThisContentWriter?._doc;

    const content_writer_articles = Promise.all(
      articles?.map(async (article) =>  await ARTICLE.findById(article?.article_id))
    );

    return res.status(200).json({
      success: true,
      message: "Content Writer Found",
      data: await content_writer_articles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

exports.createArticleByContentWriter = async (req, res) => {
  try {
    const { thumbnail, title, content, category, subcategory, tags, isVideoInclude = false } = req.body;
    const uploader = req.contentWriter;

    // required validation
    requiredValidationResponse(
      [
        {
          data: thumbnail,
          errorMessage:
            "Article thumbnail is empty. Please, provide a article thumbnail",
          regex: requiredContentRegex,
        },
        {
          data: thumbnail,
          errorMessage:
            "Article thumnail url is invalid, Please,provide a correct article thumbnail url",
          regex: validUrlRegex,
        },
        {
          data: title,
          errorMessage:
            "Article title is empty. Please, provide a article title.",
          regex: requiredContentRegex,
        },
        {
          data: title,
          errorMessage:
            "Article title is too long. article title must be up to 150 characters",
          regex: articleTitleMaxLengthRegex,
        },
        {
          data: content,
          errorMessage:
            "Article content is empty, Please, provide a article content.",
          regex: requiredContentRegex,
        },
        {
          data: category,
          errorMessage:
            "Category cannot be empty, Please provide a article category.",
          regex: requiredContentRegex,
        },
      ],
      res
    );

    await ARTICLE.create({
      thumbnail,
      title,
      content,
      author: uploader,
      category,
      subcategory,
      isVideoInclude,
      tags,
    })
      .then(async (data) => {
        await CONTENT_WRITER.findOneAndUpdate(
          { _id: uploader?._id },
          { $push: { articles: { article_id: data?._id } } }
        );
        return res.status(201).json({
          success: true,
          message: "Article created successfully",
          data,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: "Something went wrong",
          error: error?.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

exports.updatedArticleByContentWriter = async (req, res) => {
  try {
    const { _id: articleId } = req.params;
    const content_writer = req.contentWriter;
    const { thumbnail, title, content, category, subcategory, tags } = req.body;

    // required validation
    requiredValidationResponse(
      [
        {
          data: thumbnail,
          errorMessage:
            "Article thumbnail is empty. Please, provide a article thumbnail",
          regex: requiredContentRegex,
        },
        {
          data: thumbnail,
          errorMessage:
            "Article thumnail url is invalid, Please,provide a correct article thumbnail url",
          regex: validUrlRegex,
        },
        {
          data: title,
          errorMessage:
            "Article title is empty. Please, provide a article title.",
          regex: requiredContentRegex,
        },
        {
          data: title,
          errorMessage:
            "Article title is too long. article title must be up to 150 characters",
          regex: articleTitleMaxLengthRegex,
        },
        {
          data: content,
          errorMessage:
            "Article content is empty, Please, provide a article content.",
          regex: requiredContentRegex,
        },
        {
          data: category,
          errorMessage:
            "Category cannot be empty, Please provide a article category.",
          regex: requiredContentRegex,
        },
      ],
      res
    );

    const findThisArticle = await ARTICLE.findById(articleId);

    if (!findThisArticle) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong",
        error: "No article found, Please provide correct article id.",
      });
    }

    const content_writer_article = await CONTENT_WRITER.findById(
      content_writer?._id
    )?.populate("articles");

    const isThereArticle = content_writer_article?.articles?.filter(
      (uploader_article) => String(uploader_article?.article_id) === articleId
    );

    if (isThereArticle?.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: "Internal server error. You cannot edit this article",
      });
    }

    await ARTICLE?.findByIdAndUpdate(
      articleId,
      {
        $set: {
          thumbnail,
          title,
          content,
          category,
          subcategory,
          tags,
          updatedAt: new Date(),
        },
      },
      { new: true }
    )
      .then((data) => {
        return res.status(200).json({
          success: true,
          message: "Article updated successfully",
          data,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: "Something went wrong",
          error: error?.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

exports.deleteArticleByContentWriter = async (req, res) => {
  try {
    const { _id: articleId } = req.params;
    const content_writer = req.contentWriter;

    const findThisArticle = await ARTICLE.findById(articleId);

    if (!findThisArticle) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong",
        error: "No article found, Please provide correct article id.",
      });
    }

    const content_writer_article = await CONTENT_WRITER.findById(
      content_writer?._id
    )?.populate("articles");

    const isThereArticle = content_writer_article?.articles?.filter(
      (uploader_article) => String(uploader_article?.article_id) === articleId
    );

    if (isThereArticle?.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: "Internal server error. You cannot edit this article",
      });
    }

    await ARTICLE?.findByIdAndDelete(articleId)
      .then(async (data) => {
        const updateArticle = content_writer_article?.articles?.filter(
          (uploader_article) =>
            String(uploader_article?.article_id) !== articleId
        );

        await CONTENT_WRITER.findByIdAndUpdate(
          content_writer?._id,
          {
            $set: { articles: updateArticle },
          },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          message: "Article Deleted successfully",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: "Something went wrong",
          error: error?.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};
