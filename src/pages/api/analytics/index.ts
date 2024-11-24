import { db } from "@/backend/db";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import * as formatIp from "ip";
import { Analytics } from "@/backend/apiTypes";

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

const handleGet = async (res: NextApiResponse) => {
  const last30Days = Array(30)
    .fill(0)
    .map((_, i) => {
      const now = new Date();
      now.setDate(now.getDate() - (29 - i));
      return now.toISOString().split("T")[0];
    });

  const query = db
    .selectFrom("Visit")
    .select((eb) => eb.fn.countAll<number>().as("total_visits_count"))
    .select((eb) =>
      eb.fn.count<number>("ip").distinct().as("unique_visits_count")
    )
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom("Visit as v")
          .groupBy("v.country")
          .where("v.country", "is not", null)
          .select([
            "v.country",
            (eb) => eb.fn.count<number>("v.country").as("count"),
          ])
          .$castTo<{ country: string; count: number }>()
          .orderBy("count", "desc")
      ).as("top_countries")
    )
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom("Visit")
          .select([sql<string>`DATE("createdAt")`.as("date")])
          .groupBy("date")
          .where(sql<boolean>`"createdAt" >= NOW() - INTERVAL '30 days'`)
          .select((eb) => eb.fn.countAll<number>().as("count"))
          .orderBy("date")
      ).as("last_30_days")
    )
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom("Visit")
          .where("referrer", "!=", "")
          .where("referrer", "is not", null)
          .groupBy("referrer")
          .select([
            "Visit.referrer",
            (eb) => eb.fn.count<number>("referrer").as("count"),
          ])
          .$castTo<{ referrer: string; count: number }>()
          .orderBy("count", "desc")
      ).as("top_referrers")
    );

  const visits: Analytics = await query.executeTakeFirstOrThrow();

  visits.last_30_days = last30Days.map((day) => {
    const visitsThatDay = visits.last_30_days.find((v) => v.date === day);
    if (visitsThatDay) {
      return visitsThatDay;
    }
    return {
      date: day,
      count: 0,
    };
  });
  res.status(200).json(visits);
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      await handleGet(res);
    } else if (req.method === "POST") {
      await handlePost(req, res);
    } else if (req.method === "PUT") {
      await handleUpdate(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}
