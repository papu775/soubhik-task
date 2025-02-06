const fs = require("fs");
const csv = require("csv-parser");
const httpStatus = require("http-status").default;
const Questions = require("../models/Questions");
const Categories = require("../models/Categories");



const uploadQuestions = async (req,res) => {
    const file = req.file;
    try {
      if (!file) {
       res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          status: httpStatus.BAD_REQUEST,
          message: "No file uploaded",
        });
      }
  
      const questions = [];
      const finalCategories = [];
  
      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", (row) => {
         
          let categoryArr = [];
          const categories = row.categories.split(",").map(data => data.trim());
  
          const categorys = Categories.find({
            name: {$in: categories.map(category=> category.trim())},
          }).then( categorys => {
           
            for (let i=0; i<categorys.length; i++){
              categoryArr.push(categorys[i]._id);
            }
  
            questions.push({
              question: row.questions.trim(),
              categories: categoryArr,
            });
          });
  
          finalCategories.push(categorys);
        })
        .on("end", async () => {
          await Promise.all(finalCategories);
          await Questions.insertMany(questions);
        });
  
      res.status(httpStatus.CREATED).json( {
        success: true,
        status: httpStatus.CREATED,
        message: "Questions uploaded successfully",
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

const getAllQuestions = async (req,res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const questionsByCategory = await Categories.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "categories",
          as: "questions",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          questions: {
            _id: 1,
            question: 1,
          },
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);

    res.status(httpStatus.CREATED).send({
      success: true,
      STATUSCODE: httpStatus.CREATED,
      message: "List of questions each category",
      data: questionsByCategory,
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

module.exports = { uploadQuestions,getAllQuestions };