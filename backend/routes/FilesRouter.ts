import express from "express";
import { getAuthClient, saveRefreshToken } from "@/services/googleDriveOAuth";
import { Request, Response } from "express";

const router = express.Router();

router.get("/auth", async (req, res) => {
  const authClient = await getAuthClient();
  const authUrl = authClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });
  res.redirect(authUrl);
});


router.get("/oauth2callback", async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.query.code as string;
    if (!code) {
      res.status(400).send("Missing authorization code.");
      return;
    }

    const authClient = await getAuthClient();
    const { tokens } = await authClient.getToken(code);

    authClient.setCredentials(tokens);
    if (tokens.refresh_token) {
      await saveRefreshToken(tokens.refresh_token);
    }

    console.log(tokens);
    res.send("✅ Authorization successful!");
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("OAuth2 Error");
  }
});

export default router;
