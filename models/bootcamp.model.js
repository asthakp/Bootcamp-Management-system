import mongoose from "mongoose";
import { validationMessage } from "../constants/validationMessage.constants.js";
import slugify from "slugify";

const bootcampSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, validationMessage.REQUIRED_NAME_MESSAGE],
      trim: true,
      unique: true,
      minLength: [5, validationMessage.MIN_LENGTH_MESSAGE],
    },
    slug: String, //it converts 'Web development' to 'web-development' ie, all small and space replaced by -.
    description: {
      type: String,
      required: [true, validationMessage.REQUIRED_DESCRIPTION_MESSAGE],
      maxLength: [500, validationMessage.MAX_LENGTH_MESSAGE],
    },
    website: {
      type: String,
      match: [
        /https ?: \/\/ (www\.) ? [-a - zA - Z0 - 9@:%._\+~#=]{ 1, 256}\.[a-zA - Z0 - 9()]{ 1, 6 } \b([-a - zA - Z0 - 9()@:% _\+.~# ?&//=]*)/,
        validationMessage.VALID_WEBSITE_MESSAGE,
      ],
    },
    phone: {
      type: Number,
      max: [20, validationMessage.PHONE_VALIDATION_MESSAGE],
    },
    email: {
      type: String,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        validationMessage.EMAIL_VALIDATION_MESSAGE,
      ],
      required: [true, validationMessage.REQUIRED_EMAIL_MESSAGE],
      unique: true,
    },
    address: {
      type: String,
      required: [true, validationMessage.REQUIRED_ADDRESS_MESSAGE],
    },
    careers: {
      type: [String], //array of string
      required: true,
      enum: [
        "web development",
        "mobile development",
        "UI/UX",
        "data science",
        "artificial intelligence",
        "others",
      ], // if the array contains anything other than these it will be invalid
    },
    averageRating: {
      type: Number,
      min: [1, validationMessage.MINIMUM_RATING_MESSAGE],
      max: [10, validationMessage.MAXIMUM_RATING_MESSAGE],
    },
    averageCost: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
    },
    photo_public_id: {
      type: String,
    },
    jobGuarentee: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name.toLowerCase());
  next();
});

const Bootcamp = mongoose.model("Bootcamp", bootcampSchema);

export default Bootcamp;
