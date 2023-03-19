// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoDB, collections, CustomerSchema } from "../../../lib";
import { WithId, Document, ObjectId } from "mongodb";
import { ValidationError } from "yup";

type Data = {
  result: number;
  data?: Array<WithId<Document>>;
  error?: ValidationError;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == "POST") {
    let obj = req.body;
    try {
      await connectToMongoDB();
      const customerData = await CustomerSchema.validate(obj);
      let id = customerData.id;
      delete customerData.id;
      if (id == "new") {
        await collections.customers?.insertOne(customerData);
      } else {
        await collections.customers?.updateOne(
          { _id: new ObjectId(id) },
          { $set: customerData }
        );
      }

      res.status(200).json({
        result: 200,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof ValidationError) {
        res.status(200).json({
          result: 500,
          error: error,
        });
      } else {
        res.status(200).json({
          result: 400,
        });
      }
    }
  } else {
    res.status(200).json({
      result: 400,
    });
  }
}
