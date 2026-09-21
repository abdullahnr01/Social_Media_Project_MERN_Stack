import * as Yup from "yup";

export const postValidationSchema = () => {
  return Yup.object({
    title: Yup.string()
      .trim()
      .required("Title is required")
      .min(3, "Must be at least 3 characters")
      .max(50, "Title cannot be longer than 50 characters"),
    description: Yup.string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(250, "Description cannot be longer than 250 characters")
      .required("Description is required"),

    image: Yup.array()
      .min(1, "One image is required")
      .required("Image is required"),

    hashtags: Yup.string().required("One hashtag is required"),
  });
};
