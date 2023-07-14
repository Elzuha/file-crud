const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { User } = require("../db");
const {
  PASSWORD_SECRET,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRATION_TIME,
  JWT_REFRESH_EXPIRATION_TIME
} = require("../config");

let jwtBlacklist = [];

async function signin(id, password) {
  const user = await User.findOne({ where: { id } });
  if (!user) throw new Error("user_with_such_id_does_not_exist");
  const passHash = await computeHash(password, PASSWORD_SECRET);
  if (passHash !== user.passHash) throw new Error("wrong_password");
  return {
    accessToken: await generateJWT(id),
    refreshToken: await generateJWT(id, {type: "refresh"})
  };
}

async function signup(id, password) {
  const passHash = await computeHash(password, PASSWORD_SECRET);
  await User.create({ id, passHash }).catch((err) => {
    throw new Error("wrong_params");
  });
  return {
    accessToken: await generateJWT(id),
    refreshToken: await generateJWT(id, {type: "refresh"})
  };
}

async function logout(token) {
  jwtBlacklist.push(token)
  return { ok: true };
}

async function authenticateAccess(bearerToken) {
  if (!bearerToken) throw makeUnauthorizedError();
  const token = !bearerToken || !bearerToken.split
    ? "" : bearerToken.split(" ")[1] || "";
  if (!token || jwtBlacklist.includes(token)) throw makeUnauthorizedError();
  const payload = await verifyJWT(token)
    .catch(e => {
      if (e.message.includes("expired")) throw makeExpiredError();
      throw new Error(e);
    });
  if (!payload) throw makeUnauthorizedError();
  return {payload, token};
}

async function issueAccessToken(token) {
  if (!token) throw makeUnauthorizedError();
  const payload = await verifyJWT(token, {type: "refresh"})
    .catch(e => {
      if (e.message.includes("expired")) throw makeExpiredError();
      throw new Error();
    });
  if (!payload) throw makeUnauthorizedError();
  return { accessToken: await generateJWT(payload.id) };
}

async function computeHash(input, salt) {
  return new Promise((resolve) =>
    crypto.scrypt(input, salt, 64, (err, passHashBuf) => {
      if (err) throw err;
      resolve(passHashBuf.toString("hex"));
    })
  );
}

function makeUnauthorizedError() {
  const err = new Error("unauthorized");
  err.status = 401;
  return err;
}

function makeExpiredError() {
  const err = new Error("session_expired");
  err.status = 401;
  return err;
}

async function generateJWT(id, options) {
  const type = (options && options.type) || "access";
  const secret = type == "access" ? JWT_SECRET : JWT_REFRESH_SECRET;
  const expiresIn = type == "access" ? JWT_EXPIRATION_TIME : JWT_REFRESH_EXPIRATION_TIME;
  return new Promise(resolve => {
    jwt.sign({id}, secret, {expiresIn}, (err, token) => {
      if (err) throw err;
      resolve(token);
    })
  })
}

async function updateJwtBlacklist() {
  const jwtBlacklistExpired = await Promise.all(jwtBlacklist.map(async token => {
    const payload = await verifyJWT(token).catch(e => {});
    return !payload
  }))
  jwtBlacklist = jwtBlacklist.filter((token, i) => jwtBlacklistExpired[i])
}

async function verifyJWT(token, options) {
  const type = (options && options.type) || "access";
  const secret = type == "access" ? JWT_SECRET : JWT_REFRESH_SECRET;
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, {}, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    })
  });
}

module.exports = {
  signin,
  signup,
  logout,
  authenticateAccess,
  issueAccessToken,
  updateJwtBlacklist
};
