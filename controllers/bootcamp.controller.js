import cloudinary from "../config/cloudinary.config.js";
import Bootcamp from "../models/bootcamp.model.js";
import Course from "./../models/courses.model.js";

export const addBootcamp = async (req, res) => {
  try {
    let uploadedFile = await cloudinary.v2.uploader.upload(req.file.path);
    const data = req.body;
    data.photo = uploadedFile.secure_url;
    data.photo_public_id = uploadedFile.public_id; // this is needed for update
    data.user = req.user._id;
    const bootcamp = new Bootcamp(data);
    await bootcamp.save();
    res.status(200).json({
      status: true,
      message: "Bootcamp created successfully",
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

export const getBootcamp = async (req, res) => {
  try {
    return res.status(200).json(res.filteredResult);
  } catch (error) {
    console.log(error);
  }
};

export const updateBootcamp = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { isPhotoUpdated } = req.body;
    const isBootcamp = await Bootcamp.findOne({ _id: id });
    if (!isBootcamp) {
      return res.status(400).json({
        status: false,
        message: "no bootcamp found",
      });
    }

    if (isBootcamp.user.toString() === req.user._id.toString()) {
      if (isPhotoUpdated) {
        await cloudinary.v2.uploader.delete(isBootcamp.photo_public_id);
        let uploadedFile = await cloudinary.v2.uploader.upload(req.file.path);
        data.photo = uploadedFile.secure_url;
        data.photo_public_id = uploadedFile.public_id;
      }
      const updatedBootcamp = await Bootcamp.findOneAndUpdate(
        { _id: id },
        { $set: data },
        { new: true }
      );
      if (updatedBootcamp) {
        return res.status(200).json({
          status: true,
          message: "bootcamp updated successfully",
          data: updatedBootcamp,
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "you are not authorized to update this resource",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteBootcamp = async (req, res) => {
  try {
    const { bootcampId } = req.params;
    const bootcamp = await Bootcamp.findOne({ _id: bootcampId });

    if (!bootcamp) {
      return res.status(400).json({
        status: false,
        message: "no bootcamp found",
      });
    }
    const bootcampUser = bootcamp.user.toString();
    const user = req.user._id.toString();
    console.log(bootcampUser, user);
    if (bootcampUser === user) {
      const deletedBootcamp = await Bootcamp.findOneAndDelete({
        _id: bootcampId,
      });

      const courses = await Course.find({ bootcamp: bootcampId });
      if (courses.length > 0) {
        await Course.deleteMany({ bootcamp: bootcampId });
      }
      if (deletedBootcamp) {
        return res.status(200).json({
          status: true,
          message: "bootcamp deleted successfully",
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "you are not authorized to delete this bootcamp",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};
