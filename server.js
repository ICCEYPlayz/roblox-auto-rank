import express from "express";
import noblox from "noblox.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const SECRET = process.env.RANK_SECRET;
const ROBLOSECURITY = process.env.ROBLOSECURITY;

const GROUP_ID = 3189386;

let loggedIn = false;

async function ensureLogin() {
  if (loggedIn) return;
  const user = await noblox.setCookie(ROBLOSECURITY);
  loggedIn = true;
  console.log("Logged in as", user.UserName);
}

app.get("/", (req, res) => {
  res.send("ok");
});

app.post("/rank", async (req, res) => {
  const { secret, userId, rank } = req.body;

  if (secret !== SECRET) {
    return res.status(401).json({ ok: false });
  }

  try {
    await ensureLogin();
    await noblox.setRank(GROUP_ID, Number(userId), Number(rank));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
