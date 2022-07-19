import aws4 from "aws4";
import { NextApiRequest, NextApiResponse } from "next/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url, body } = JSON.parse(req.body);

  const { host, pathname, href } = new URL(url);

  const keys = req.headers.authorization!.split(" ")[1]!;
  const plaintext = Buffer.from(keys, "base64").toString();
  const [accessKeyId, secretAccessKey] = plaintext.split(":");

  const options = {
    host: host,
    path: pathname,
    service: "execute-api",
    region: "us-west-2",
    method: "POST",
    url: href,
    body: body,
    headers: {
      "Content-Type": "application/json",
    },
  };

  aws4.sign(options, {
    accessKeyId,
    secretAccessKey,
  });

  res.status(200).json(options);
};

export default handler;
