import aws4 from "aws4";
import { NextApiRequest, NextApiResponse } from "next/types";

// next api handler function
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    values: { accessKey, secretKey },
    urlString,
    body,
  } = JSON.parse(req.body);

  const url = new URL(urlString);

  console.log(accessKey, secretKey, url, body);

  const options = {
    host: url.host,
    path: url.pathname,
    service: "execute-api",
    region: "us-west-2",
    method: "POST",
    url: url.href,
    body: body,
    headers: {
      "Content-Type": "application/json",
    },
  };

  console.log(options);

  aws4.sign(options, {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  });

  res.status(200).json(options);
};

export default handler;
