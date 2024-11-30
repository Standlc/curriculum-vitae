import { db } from "./db";

const seedDevices = async () => {
  try {
    const exist = await db.selectFrom("Device").execute();

    if (exist.length > 0) {
      console.log("Devices already seeded");
      return;
    }

    await db
      .insertInto("Device")
      .values([
        {
          id: 1,
          type: "Mobile",
        },
        {
          id: 2,
          type: "Desktop",
        },
      ])
      .executeTakeFirstOrThrow();
  } catch (error) {
    console.error(error);
  }
};

seedDevices();
