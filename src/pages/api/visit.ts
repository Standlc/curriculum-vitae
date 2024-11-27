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

const createVisiter = async () => {
  const visiter = await db
    .insertInto("Visiter")
    .defaultValues()
    .returningAll()
    .executeTakeFirstOrThrow();

  return visiter;
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

const setVisiterToken = async (res: NextApiResponse, visiter: VisiterType) => {
  const visiterToken = await new jose.SignJWT(visiter)
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  res.setHeader(
    "Set-Cookie",
    `visiterToken=${visiterToken}; HttpOnly; SameSite=Strict; Path=/`
  );
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data: body, success } = VisitCreateSchema.safeParse(req.body);
  const ip = getIpAddress(req);
  if (!success || ip === undefined) {
    return res.status(400).json({ message: "Invalid Request" });
  }

  const visitTime = new Date(body.time).toISOString();

  let visiter = getVisiter(req);
  if (visiter === undefined) {
    const createdVisiter = await createVisiter();
    visiter = {
      id: createdVisiter.id,
      sessionId: undefined,
    };
  } else {
    const previousVisitSession = await db
      .selectFrom("Visit")
      .where("Visit.visiterId", "=", visiter.id)
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
        id: visiter.id,
        sessionId: updatedVisit.id,
      });
      return res.status(200).json({ visitId: updatedVisit.id });
    }
  }

  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const data = await response.json();

  const newVisit = await db
    .insertInto("Visit")
    .values({
      ip,
      visiterId: visiter.id,
      createdAt: visitTime,
      endAt: visitTime,
      country: data.country,
      countryCode: data.countryCode,
      region: data.region,
      regionName: data.regionName,
      city: data.city,
      lat: data.lat,
      lon: data.lon,
      referrer: body.referrer,
      userAgent: req.headers["user-agent"],
    })
    .returning(["Visit.id"])
    .executeTakeFirstOrThrow();

  await setVisiterToken(res, { id: visiter.id, sessionId: newVisit.id });
  res.status(200).json({ visitId: newVisit.id });
};

const handleUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data: body, success } = VisitUpdateSchema.safeParse(req.body);
  const visiter = getVisiter(req);

  if (visiter === undefined) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!success || visiter?.sessionId === undefined) {
    return res.status(400).send({ message: "Invalid Request" });
  }

  const visitTime = new Date(body.time).toISOString();
  const updatedVisit = await db
    .updateTable("Visit")
    .set({
      endAt: visitTime,
    })
    .where("Visit.id", "=", visiter.sessionId)
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
      await handlePost(req, res);
    } else if (req.method === "PUT") {
      await handleUpdate(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
