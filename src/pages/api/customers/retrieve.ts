// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoDB, collections } from "../../../lib";
import { WithId, Document, ObjectId } from "mongodb";

type Data = {
  result: number;
  data?: Array<WithId<Document>> | Array<Document> | undefined;
};

type QueryFilter = {
  [key: string]: string | number;
};

type Query = {
  filter?: QueryFilter;
  sort?: QueryFilter;
  [key: string]: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == "POST") {
    let obj = req.body;
    let qry: Query = {};
    let sort: QueryFilter = {};
    if (obj.filter) {
      if (obj.filter._id) {
        qry._id = new ObjectId(obj.filter._id);
      }
    }
    if (obj.sort) {
      sort.sort = obj.sort;
    }

    await connectToMongoDB();
    let dataCustomers: Array<WithId<Document>> | Array<Document> | undefined =
      [];
    if (!obj.sort.address) {
      dataCustomers = await collections.customers
        ?.find(qry, sort)
        .collation({ locale: "en" })
        .toArray();
    } else {
      dataCustomers = await collections.customers
        ?.aggregate([
          {
            $addFields: {
              addressCount: { $size: { $ifNull: ["$address", []] } },
            },
          },
          {
            $sort: { addressCount: obj.sort.address },
          },
        ])
        .toArray();
    }

    if (dataCustomers) {
      for (let i = 0; i < dataCustomers?.length; i++) {
        dataCustomers[i].id = dataCustomers[i]._id;
        delete dataCustomers[i]._id;
      }
    }

    res.status(200).json({
      result: 200,
      data: dataCustomers,
    });
  } else {
    res.status(200).json({
      result: 400,
    });
  }
}
