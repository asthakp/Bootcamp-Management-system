import Course from "../models/courses.model.js";
import Bootcamp from "../models/bootcamp.model.js";
import Review from "./../models/reviews.model.js";

export const addCourse = async (req, res) => {
  try {
    const { bootcampId } = req.params;
    const isBootcamp = await Bootcamp.findOne({ _id: bootcampId });
    if (!isBootcamp) {
      return res.status(400).json({
        status: false,
        message: "Bootcamp doesnt exist. You cannot add course",
      });
    }
    const data = req.body;
    data.user = req.user._id;
    data.bootcamp = bootcampId;
    const course = new Course(data);
    await course.save();
    res.status(200).json({
      status: true,
      data: course,
      message: "course created successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

export const getCourse = async (req, res) => {
  try {
    return res.status(200).json(res.filteredResult);
  } catch (error) {
    console.log(error);
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { bootcampId } = req.body;
    const data = req.body;
    const isBootcamp = await Bootcamp.findOne({ _id: bootcampId });
    if (!bootcampId) {
      return res.status(400).json({
        status: false,
        message: "no bootcamp found",
      });
    }
    const isCourse = await Course.findOne({ _id: courseId });
    if (!isCourse) {
      return res.status(400).json({
        status: false,
        message: "no course found",
      });
    }
    if (isCourse.user.toString() === req.user._id.toString()) {
      const updatedCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $set: data },
        { new: true }
      );
      return res.status(200).json({
        status: true,
        message: "couse updated successfully",
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "you are not authorized to update this course",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "an error occurred",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const isCourse = await Course.findOne({ _id: courseId });
    if (!isCourse) {
      return res.status(400).json({
        status: true,
        message: "no course found",
      });
    }
    if (isCourse.user.toString() === req.user._id.toString()) {
      const deletedCourse = await Course.findOneAndDelete({ _id: courseId });
      const review = await Review.findOne({ course: courseId });
      if (review.length > 0) {
        await review.deleteMany({ course: courseId });
      }
      if (deletedCourse) {
        return res.status(200).json({
          status: true,
          message: "course deleted successfully",
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "not authorized to delete this course",
      });
    }
  } catch (error) {}
};
