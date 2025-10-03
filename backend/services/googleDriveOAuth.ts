import { db } from "@/models";
import { google } from "googleapis";

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export const getAuthClient = async () => {
  const token = await db.tokens.findOne();
  if (token) {
    oAuth2Client.setCredentials({ refresh_token: token.getDataValue('value') });
  }
  return oAuth2Client;
};

export const saveRefreshToken = async (refreshToken: string) => {
  let token = await db.tokens.findOne({ where: { type: "google" } });
  if (token) {
    token.setDataValue('value',refreshToken);
    await token.save();
  } else {
    await db.tokens.create({ type: "google", value: refreshToken});
  }
};

export const getDriveClient = async () => {
    const auth = await getAuthClient();
    return google.drive({
      version: "v3",
      auth,
    }
)};