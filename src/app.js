const express = require("express");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const { initializeDB } = require("./db");
const { JWT_BLACKLIST_MAINTAIN_PAUSE } = require('./config')
const { createFilesDir } = require("./services/file");
const { updateJwtBlacklist } = require("./services/auth");
const { normalizeError } = require("./formatting")

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(function (req, res, next) {
  let err = new Error("not_found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  next(normalizeError(err));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.status ? err.message : "internal_server_error",
    ok: false,
  });
});

(async () => {
  await initializeDB()
  await createFilesDir()
  setInterval(updateJwtBlacklist, JWT_BLACKLIST_MAINTAIN_PAUSE)
  app.listen(process.env.PORT, () =>
    console.log(`App listening on port ${process.env.PORT}`)
  );
})();
