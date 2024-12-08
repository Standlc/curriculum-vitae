import * as jose from "jose";
import {
  VisitCreateSchema,
  VisitUpdateSchema,
  VisiterSchema,
  VisiterType,
} from "@/backend/apiTypes";
import { db } from "@/backend/db";
import * as formatIp from "ip";
import { sql } from "kysely";
import { NextApiRequest, NextApiResponse } from "next";

const getDevice = (req: NextApiRequest) => {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobile = mobileRegex.test(req.headers["user-agent"] ?? "");

  return isMobile ? 1 : 2;
};

const getIpAddress = (req: NextApiRequest) => {
  const forwarded = req.headers["x-forwarded-for"];
  let ip = req.socket.remoteAddress;

  if (Array.isArray(forwarded)) {
    ip = forwarded[0].split(",")[0].trim();
  } else if (typeof forwarded === "string") {
    ip = forwarded.split(",")[0].trim();
  }

  if (ip) {
    ip = formatIp.toString(formatIp.toBuffer(ip));
  }

  return ip;
};

const createVisiter = async () => {
  const visitor = await db
    .insertInto("Visitor")
    .defaultValues()
    .returningAll()
    .executeTakeFirstOrThrow();

  return visitor;
};

const getVisiter = (req: NextApiRequest) => {
  try {
    const header = req.headers["x-visiter"];
    const { data } = VisiterSchema.safeParse(
      JSON.parse(Array.isArray(header) ? header[0] : header ?? "{}")
    );
    return data;
  } catch (error) {
    void error;
    return undefined;
  }
};

const setVisiterToken = async (res: NextApiResponse, visitor: VisiterType) => {
  const visiterToken = await new jose.SignJWT(visitor)
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1000); // make the cookie last forever

  res.setHeader(
    "Set-Cookie",
    `visiterToken=${visiterToken}; HttpOnly; SameSite=Strict; Path=/; Expires=${expirationDate.toUTCString()}`
  );
};

const checkVisitorMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    visitor: VisiterType | undefined
  ) => Promise<void> | Promise<any>
) => {
  let visitor = getVisiter(req);

  if (visitor) {
    const visitorRecord = await db
      .selectFrom("Visitor")
      .where("id", "=", visitor.id)
      .select("id")
      .executeTakeFirst();

    if (visitorRecord) {
      const blackListedVisitor = await db
        .selectFrom("BlackListedVisitor")
        .where("visitorId", "=", visitorRecord.id)
        .executeTakeFirst();

      if (blackListedVisitor) {
        return res.status(403).json({ message: "Visitor is blacklisted" });
      }
    } else {
      visitor = undefined;
    }
  }

  await handler(req, res, visitor);
};

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  visitor: VisiterType | undefined
) => {
  const { data: body, success } = VisitCreateSchema.safeParse(req.body);
  const ip = getIpAddress(req);
  if (!success || ip === undefined) {
    return res.status(400).json({ message: "Invalid Request" });
  }
  const visitTime = new Date(body.time).toISOString();

  if (!visitor) {
    const createdVisiter = await createVisiter();
    visitor = {
      id: createdVisiter.id,
      sessionId: 0, // won't be used
    };
  } else {
    const previousVisitSession = await db
      .selectFrom("Visit")
      .where("Visit.visitorId", "=", visitor.id)
      .where(sql<boolean>`"endAt" >= NOW() - INTERVAL '10 seconds'`)
      .select(["Visit.id"])
      .executeTakeFirst();

    if (previousVisitSession) {
      const updatedVisit = await db
        .updateTable("Visit")
        .set({
          endAt: visitTime,
        })
        .where("Visit.id", "=", previousVisitSession.id)
        .returning(["Visit.id"])
        .executeTakeFirstOrThrow();

      await setVisiterToken(res, {
        id: visitor.id,
        sessionId: updatedVisit.id,
      });
      return res.status(200).json({ visitId: updatedVisit.id });
    }
  }

  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const data = await response.json();

  const deviceType = getDevice(req);

  const newVisit = await db
    .insertInto("Visit")
    .values({
      ip,
      visitorId: visitor.id,
      createdAt: visitTime,
      endAt: visitTime,
      country: data.country,
      countryCode: data.countryCode,
      region: data.region,
      regionName: data.regionName,
      city: data.city,
      lat: data.lat,
      lon: data.lon,
      referrer: body.referrer !== "" ? body.referrer : "Direct",
      userAgent: req.headers["user-agent"],
      deviceId: deviceType,
    })
    .returning(["Visit.id"])
    .executeTakeFirstOrThrow();

  await setVisiterToken(res, { id: visitor.id, sessionId: newVisit.id });
  res.status(200).json({ visitId: newVisit.id });
};

const handleUpdate = async (
  req: NextApiRequest,
  res: NextApiResponse,
  visitor: VisiterType | undefined
) => {
  if (!visitor) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { data: body, success } = VisitUpdateSchema.safeParse(req.body);
  if (!success || visitor?.sessionId === undefined) {
    return res.status(400).send({ message: "Invalid Request" });
  }

  const visitTime = new Date(body.time).toISOString();
  const updatedVisit = await db
    .updateTable("Visit")
    .set({
      endAt: visitTime,
    })
    .where("Visit.id", "=", visitor.sessionId)
    .returning("Visit.id")
    .executeTakeFirst();

  if (!updatedVisit) {
    return res.status(404).json({ message: "Visit not found" });
  }
  res.status(200).json({ visitId: updatedVisit.id });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      await checkVisitorMiddleware(req, res, handlePost);
    } else if (req.method === "PUT") {
      await checkVisitorMiddleware(req, res, handleUpdate);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
