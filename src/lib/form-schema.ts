import * as Yup from "yup";
import { ObjectId } from "mongodb";

export const CustomerSchema = Yup.object().shape({
  id: Yup.string(),
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  gender: Yup.string().required().oneOf(["male", "female"]),
  address: Yup.array()
    .of(
      Yup.object().shape({
        street: Yup.string()
          .min(2, "Too Short!")
          .max(100, "Too Long!")
          .required("Required"),
        city: Yup.string()
          .min(2, "Too Short!")
          .max(50, "Too Long!")
          .required("Required"),
        house: Yup.string()
          .min(2, "Too Short!")
          .max(20, "Too Long!")
          .required("Required"),
        country: Yup.string()
          .min(2, "Too Short!")
          .max(50, "Too Long!")
          .required("Required"),
      })
    )
    .required()
    .min(1, "minimum one address"),
});

export type CustomerDataSchema = Yup.InferType<typeof CustomerSchema>;
