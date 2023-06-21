import Course from "../models/courses.model.js";
import Bootcamp from "../models/bootcamp.model.js";

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
