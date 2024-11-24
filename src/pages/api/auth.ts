import { NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";

const checkPassword = (password: string) => {
  return password === process.env.ANALYTICS_PASSWORD;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (!checkPassword(req.body.password)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = await new jose.SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1 hour")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    res.setHeader(
      "Set-Cookie",
      `token=${accessToken}; HttpOnly; SameSite=Strict; Path=/`
    );

    return res.status(200).json({ message: "Successfuly Logged In" });
  }
};

export default handler;
