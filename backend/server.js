require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const axios = require("axios");



const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: "some_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors({ 
    origin: "http://localhost:3000", 
    credentials: true 
  }));
  
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
        profile.accessToken = accessToken;
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// GitHub OAuth Routes
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user", "repo"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:3000/dashboard"); // Redirect after successful login
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000/");
  });
});

app.get("/", (req, res) => {
  res.send("GitHub OAuth Backend Running");
});

app.get("/api/user", (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    res.json({ 
      username: req.user.username, 
      avatar: req.user.photos[0].value,
      token: req.user.accessToken // Send the token if needed in frontend
    });
  });
  
  app.get("/api/pullrequests/:owner/:repo", async (req, res) => {
    if (!req.user || !req.user.accessToken) 
      return res.status(401).json({ error: "Unauthorized" });
  
    try {
      const { owner, repo } = req.params;
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/pulls`,
        { headers: { Authorization: `Bearer ${req.user.accessToken}` } }
      );
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch pull requests" });
    }
  });
  app.get("/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.redirect("http://localhost:3000/");
      });
    });
  });

  app.get("/api/repos", async (req, res) => {
    try {
      console.log("Cookies:", req.cookies); // Debugging line
      const accessToken = req.cookies?.token; // Make sure token exists
      if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized - No Token" });
      }
  
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      console.log("GitHub API Response:", response.data); // Debugging
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching repos:", error.response?.data || error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
