import { db } from "@/backend/db";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { Analytics } from "@/backend/apiTypes";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      await handleGet(res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}
