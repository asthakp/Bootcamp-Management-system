import cloudinary from "../config/cloudinary.config.js";
import Bootcamp from "../models/bootcamp.model.js";

export const addBootcamp = async (req, res) => {
  try {
    let uploadedFile = await cloudinary.v2.uploader.upload(req.file.path);
    const data = req.body;
    data.photo = uploadedFile.secure_url;
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
