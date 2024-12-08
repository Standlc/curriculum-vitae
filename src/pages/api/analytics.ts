import { db } from "@/backend/db";
import { NotNull, sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import {
  Analytics,
  AnalyticsOverSomeTime,
  AnalyticsTimeOptions,
  AnalyticsTimeOptionsType,
} from "@/backend/apiTypes";

const getAnalyticsOverSomeTime = async (time: AnalyticsTimeOptionsType) => {
  const analytics = await db

    .with("NotBlackListedVisit", (db) =>
      db
        .selectFrom("Visit")
        .where(
          sql<boolean>`"createdAt" >= NOW() - MAKE_INTERVAL(days => ${time})`
        )
        // remove blacklisted visits
        .leftJoin(
          "BlackListedVisitor",
          "BlackListedVisitor.visitorId",
          "Visit.visitorId"
        )
        .where("BlackListedVisitor.visitorId", "is", null)
        .selectAll("Visit")
    )

    .with("top_referrer", (db) =>
      db
        .selectFrom("NotBlackListedVisit as Visit")
        .where("referrer", "!=", "")
        .where("referrer", "is not", null)
        .select((eb) => [
          eb.fn.count<number>("Visit.referrer").as("count"),
          "referrer",
        ])
        .groupBy("referrer")
        .orderBy("count", "desc")
        .limit(1)
    )

    .with("top_device", (db) =>
      db
        .selectFrom("NotBlackListedVisit as Visit")
        .innerJoin("Device", "Device.id", "Visit.deviceId")
        .select((eb) => [
          eb.fn.count<number>("Visit.deviceId").as("count"),
          "Device.type",
        ])
        .groupBy("Device.type")
        .orderBy("count", "desc")
        .limit(1)
    )

    .selectFrom("NotBlackListedVisit as Visit")
    .select((eb) => [
      jsonArrayFrom(
        eb
          .selectFrom("Visit")
          .select([sql<string>`DATE("createdAt")`.as("date")])
          .select((eb) => [
            eb.fn.countAll<number>().as("visits_count"),
            eb.fn.count<number>("visitorId").distinct().as("visitors_count"),
          ])
          .orderBy("date")
          .groupBy("date")
      ).as("visits_per_day"),

      sql<number>`EXTRACT(EPOCH FROM AVG("endAt" - "createdAt"))`.as(
        "avg_visit_time"
      ),

      eb.selectFrom("top_device").select(["top_device.type"]).as("top_device"),

      eb
        .selectFrom("top_device")
        .select(["top_device.count"])
        .as("top_device_count"),

      eb.fn.count<number>("Visit.id").as("visits_count"),

      eb.fn.count<number>("Visit.visitorId").distinct().as("visitors_count"),

      eb
        .selectFrom("Visitor")
        .where(
          "createdAt",
          ">=",
          sql<Date>`NOW() - MAKE_INTERVAL(days => ${time})`
        )
        // remove blacklisted visitors
        .leftJoin(
          "BlackListedVisitor",
          "BlackListedVisitor.visitorId",
          "Visitor.id"
        )
        .where("BlackListedVisitor.visitorId", "is", null)
        .select((eb) => [
          eb.fn.count<number>("Visitor.id").distinct().as("count"),
        ])
        .as("new_visitors_count"),

      eb
        .selectFrom("top_referrer")
        .select(["top_referrer.referrer as top_referrer"])
        .as("top_referrer"),

      eb
        .selectFrom("top_referrer")
        .select(["top_referrer.count as top_referrer_count"])
        .as("top_referrer_count"),
    ])
    .executeTakeFirstOrThrow();

  return {
    ...analytics,
    timePeriod: time,
  } satisfies AnalyticsOverSomeTime;
};

const handleGet = async (res: NextApiResponse) => {
  const query = db

    .with("NotBlackListedVisit", (db) =>
      db
        .selectFrom("Visit")
        // remove blacklisted visits
        .leftJoin(
          "BlackListedVisitor",
          "BlackListedVisitor.visitorId",
          "Visit.visitorId"
        )
        .where("BlackListedVisitor.visitorId", "is", null)
        .selectAll("Visit")
    )

    .with(
      "times",
      (db) =>
        db
          .selectFrom("NotBlackListedVisit")
          .select([sql<number>`"endAt" - "createdAt"`.as("time"), "createdAt"])
          .orderBy("time", "asc")
      // .offset(sql`ROUND((select "count" from "visits_count") * 0.05)`)
      // .limit(sql`ROUND((select "count" from "visits_count")  * 0.9)`)
    )

    .selectFrom("NotBlackListedVisit")
    .select((eb) => [
      eb.fn.count<number>("NotBlackListedVisit.id").as("total_visits_count"),

      eb
        .selectFrom("times")
        .select([
          sql<number>`EXTRACT(EPOCH FROM AVG("time"))`.as("avg_visit_time"),
        ])
        .as("avg_visit_time"),

      eb.fn
        .count<number>("NotBlackListedVisit.visitorId")
        .distinct()
        .as("unique_visits_count"),

      jsonArrayFrom(
        eb
          .selectFrom("NotBlackListedVisit as v")
          .where("v.country", "is not", null)
          .select([
            "v.country",
            (eb) => eb.fn.count<number>("v.country").as("count"),
          ])
          .$narrowType<{ country: NotNull }>()
          .orderBy("count", "desc")
          .groupBy("v.country")
          .limit(6)
      ).as("countries"),

      jsonArrayFrom(
        eb
          .selectFrom("NotBlackListedVisit as Visit")
          .where("referrer", "!=", "")
          .where("referrer", "is not", null)
          .select([
            "Visit.referrer",
            (eb) => eb.fn.count<number>("referrer").as("count"),
          ])
          .$castTo<{ referrer: string; count: number }>()
          .orderBy("count", "desc")
          .groupBy("referrer")
      ).as("referrers"),

      jsonArrayFrom(
        eb
          .selectFrom("NotBlackListedVisit as Visit")
          .innerJoin("Device", "Device.id", "Visit.deviceId")
          .select([
            (eb) => eb.fn.count<number>("deviceId").as("count"),
            "Device.type",
          ])
          .groupBy("Device.type")
          .orderBy("count", "desc")
      ).as("devices"),
    ])
    .$narrowType<{ total_visits_count: NotNull }>();

  const allTimeAnalytics = await query.executeTakeFirstOrThrow();

  const analyticsOverSomeTime: AnalyticsOverSomeTime =
    await getAnalyticsOverSomeTime(30);

  const data: Analytics = {
    ...allTimeAnalytics,
    analyticsOverSomeTime,
  };

  res.status(200).json(data);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      if (req.query["time"] !== undefined) {
        const timePeriod: AnalyticsTimeOptionsType | number = Number(
          req.query["time"]
        );

        const checkTimeValues = (s: any): s is AnalyticsTimeOptionsType => {
          return AnalyticsTimeOptions.includes(s);
        };

        if (!checkTimeValues(timePeriod)) {
          return res.status(400).json({ message: "Invalid Time Option" });
        }

        const analytics = await getAnalyticsOverSomeTime(timePeriod);
        res.status(200).json(analytics);
      } else {
        await handleGet(res);
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}
