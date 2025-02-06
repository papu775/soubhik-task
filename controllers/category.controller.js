const httpStatus = require("http-status").default;
const Category = require("../models/Categories");
const joi = require("joi");

const createCategorySchema = joi.object({
    name: joi.string().trim().required(),
    description: joi.string().required(),
});



const createCategory = async (req, res) => {
  const { name, description } = req.body;

  const { error } = createCategorySchema.validate(req.body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      status: httpStatus.BAD_REQUEST,
      message: error.details[0].message,
    });
  }

  try {
    if (await Category.findOne({ name })) {
      return res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        status: httpStatus.BAD_REQUEST,
        message: "Category already exists",
      });
    }
    const category = new Category({
      name,
      description,
    });
    await category.save();

    res.status(httpStatus.CREATED).send({
      success: true,
      status: httpStatus.CREATED,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getAllCategories = async (req, res) => {
     
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 10;
  try {
   
    const categories = await Category.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      }
    ]);

    res.status(httpStatus.OK).send({
      success: true,
      status: httpStatus.OK,
      message: "Categories fetched successfully",
      data: categories,
      pagination: {
        page,
        limit,
        total: categories.length,
      },
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
};
