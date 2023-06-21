import Reviews from "../models/reviews.model.js";
import Course from "../models/courses.model.js";
export const addReview = async (req, res) => {
  try {
    const { bootcampId, courseId } = req.params;
    const isCourse = await Course.findOne({
      _id: courseId,
      bootcamp: bootcampId,
    });
    if (!isCourse) {
      return res.status(400).json({
        status: false,
        message: "Bootcamp or course doesnt exist you cant add review",
      });
    }
    const data = req.body;
    data.user = req.user._id;
    data.bootcamp = bootcampId;
    data.course = courseId;
    const review = new Reviews(data);
    await review.save();
    return res.status(200).json({
      status: true,
      data: data,
      message: "review added successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};
