import { db } from "@/backend/db";
import * as formatIp from "ip";
import { sql } from "kysely";
import { NextApiRequest, NextApiResponse } from "next";

const getIpAddress = (req: NextApiRequest) => {
  const forwarded = req.headers["x-forwarded-for"];
  let ip = req.socket.remoteAddress;

  if (Array.isArray(forwarded)) {
    ip = forwarded[0].split(",")[0].trim();
  } else if (typeof forwarded === "string") {
    ip = forwarded.split(",")[0].trim();
  }

  // console.log(forwarded, ip);

  if (ip) {
    ip = formatIp.toString(formatIp.toBuffer(ip));
  }
  // console.log(ip);

  return ip;
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const ip = getIpAddress(req);
  if (ip === undefined) {
    return res.status(400).json({ message: "No IP address provided" });
  }

  const time = new Date(req.body.time);

  const previousVisitSession = await db
    .selectFrom("Visit")
    .where("Visit.ip", "=", ip)
    .where(sql<boolean>`"endAt" >= NOW() - INTERVAL '10 seconds'`)
    .select(["Visit.endAt", "Visit.id"])
    .executeTakeFirst();

  if (previousVisitSession) {
    const updatedVisit = await db
      .updateTable("Visit")
      .set({
        endAt: time,
      })
      .where("Visit.id", "=", previousVisitSession.id)
      .returningAll()
      .executeTakeFirstOrThrow();

    // console.log(updatedVisit);

    res.status(200).json({ visitId: updatedVisit.id });
  } else {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();

    const newVisit = await db
      .insertInto("Visit")
      .values({
        ip,
        createdAt: time.toISOString(),
        endAt: time.toISOString(),
        country: data.country,
        countryCode: data.countryCode,
        region: data.region,
        regionName: data.regionName,
        city: data.city,
        lat: data.lat,
        lon: data.lon,
        referrer: req.body.referrer,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    console.debug(newVisit);

    res.status(200).json({ visitId: newVisit.id });
  }
};

const handleUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  const ip = getIpAddress(req);
  if (ip === undefined) {
    return res.status(400).json({ message: "No IP address provided" });
  }

  const time = new Date(req.body.time);
  console.debug(time);

  const updatedVisit = await db
    .updateTable("Visit")
    .set({
      endAt: time.toISOString(),
    })
    .where("Visit.ip", "=", ip)
    .where("Visit.id", "=", req.body.visitId)
    .returningAll()
    .executeTakeFirst();

  if (!updatedVisit) {
    return res.status(404).json({ message: "Visit not found" });
  }
  res.status(200).json({ visitId: updatedVisit.id });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      await handlePost(req, res);
    } else if (req.method === "PUT") {
      await handleUpdate(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
  }
};

export default handler;
