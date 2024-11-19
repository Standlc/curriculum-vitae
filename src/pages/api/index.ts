// import prisma from "@/backend/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const forwarded = req.headers["x-forwarded-for"];
      let ip = req.socket.remoteAddress;
      if (Array.isArray(forwarded)) {
        ip = forwarded[0].split(",")[0];
      } else if (typeof forwarded === "string") {
        ip = forwarded.split(",")[0];
      }

      if (ip === undefined) {
        return res.status(400).json({ message: "No IP address provided" });
      }

      const response = await fetch(`http://ip-api.com/json/${"6.76.21.21"}`);
      if (!response.ok) {
        return res.status(500).json({ message: "Failed to fetch IP data" });
      }

      const data = await response.json();
      if (data.status !== "success") {
        return res.status(404).json({ message: "Could not locate IP address" });
      }

      // console.log(data);

      return res.status(200).json(data);

      // const newVisit = await prisma.visit.create({
      //   data: {
      //     ip,
      //     country: data.country,
      //     countryCode: data.countryCode,
      //     region: data.region,
      //     regionName: data.regionName,
      //     city: data.city,
      //     lat: data.lat,
      //     lon: data.lon,
      //   },
      // });

      // res.status(200).json(newVisit);
    } else if (req.method === "POST") {
      res.status(200);
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
