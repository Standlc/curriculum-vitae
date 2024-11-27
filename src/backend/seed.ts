import { db } from "./db";

const randomSessionDates = () => {
  const start = new Date();
  const daysAgo = Math.floor(Math.random() * 15);
  start.setDate(start.getDate() - daysAgo);

  const end = new Date(start);
  end.setSeconds(end.getSeconds() + Math.floor(Math.random() * 1000));

  return [start, end];
};

const DUMMY_DATA = [
  {
    ip: "192.168.0.176",
    country: "United States",
    countryCode: "US",
    city: "San Francisco",
    region: "CA",
    id: 1,
    lat: 37.751,
    lon: -97.822,
    regionName: "California",
    referrer: "google.com",
  },
  {
    ip: "192.168.0.177",
    country: "Canada",
    countryCode: "CA",
    city: "Toronto",
    region: "ON",
    id: 2,
    lat: 43.651,
    lon: -79.383,
    regionName: "Ontario",
    referrer: "linkedin.com",
  },
  {
    ip: "192.168.0.178",
    country: "United States",
    countryCode: "US",
    city: "San Francisco",
    region: "CA",
    id: 3,
    lat: 51.507,
    lon: -0.127,
    regionName: "England",
    referrer: "facebook.com",
  },
  {
    ip: "192.168.0.179",
    country: "Germany",
    countryCode: "DE",
    city: "Berlin",
    region: "BE",
    id: 4,
    lat: 52.52,
    lon: 13.405,
    regionName: "Berlin",
    referrer: "twitter.com",
  },
  {
    ip: "192.168.0.180",
    country: "United States",
    countryCode: "US",
    city: "San Francisco",
    region: "CA",
    id: 5,
    lat: -33.865,
    lon: 151.209,
    regionName: "New South Wales",
    referrer: "linkedin.com",
  },
  {
    ip: "192.168.0.181",
    country: "France",
    countryCode: "FR",
    city: "Paris",
    region: "IDF",
    id: 6,
    lat: 48.856,
    lon: 2.352,
    regionName: "Île-de-France",
    referrer: "linkedin.com",
  },
  {
    ip: "192.168.0.182",
    country: "Spain",
    countryCode: "ES",
    city: "Madrid",
    region: "M",
    id: 7,
    lat: 40.416,
    lon: -3.703,
    regionName: "Madrid",
    referrer: "twitter.com",
  },
  {
    ip: "192.168.0.183",
    country: "France",
    countryCode: "FR",
    city: "Paris",
    region: "IDF",
    id: 8,
    lat: 41.902,
    lon: 12.496,
    regionName: "Lazio",
    referrer: "twitter.com",
  },
  {
    ip: "192.168.0.184",
    country: "Japan",
    countryCode: "JP",
    city: "Tokyo",
    region: "13",
    id: 9,
    lat: 35.689,
    lon: 139.691,
    regionName: "Tokyo",
  },
  {
    ip: "192.168.0.183",
    country: "France",
    countryCode: "FR",
    city: "Paris",
    region: "IDF",
    id: 10,
    lat: -22.906,
    lon: -43.172,
    regionName: "Rio de Janeiro",
    referrer: "linkedin.com",
  },
  {
    ip: "192.168.0.184",
    country: "India",
    countryCode: "IN",
    city: "Mumbai",
    region: "MH",
    id: 11,
    lat: 19.076,
    lon: 72.877,
    regionName: "Maharashtra",
    referrer: "linkedin.com",
  },
  {
    ip: "192.168.0.185",
    country: "France",
    countryCode: "FR",
    city: "Paris",
    region: "IDF",
    id: 12,
    lat: -33.924,
    lon: 18.424,
    regionName: "Western Cape",
    referrer: "linkedin.com",
  },
];

const seedVisits = async () => {
  const sessions = Array(12).fill(0).map(randomSessionDates);

  try {
    const visiters = await db
      .insertInto("Visiter")
      .defaultValues()
      .defaultValues()
      .defaultValues()
      .defaultValues()
      .defaultValues()
      .defaultValues()
      .defaultValues()
      .defaultValues()
      .defaultValues()
      .returningAll()
      .execute();

    await db.deleteFrom("Visit").execute();

    await db
      .insertInto("Visit")
      .values(
        DUMMY_DATA.map((d, i) => {
          return {
            ...d,
            visiterId: visiters[Math.floor(Math.random() * visiters.length)].id,
            createdAt: sessions[i][0],
            endAt: sessions[i][1],
          };
        })
      )
      .executeTakeFirstOrThrow();
  } catch (error) {
    console.error(error);
  }
};

seedVisits();
