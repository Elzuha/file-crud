const authService = require("../services/auth");

async function signup(req, res, next) {
  const result = await authService
    .signup(req.body.id, req.body.password)
    .catch(next);
  if (!result) return new Error();
  res.json(result)
}

async function signin(req, res, next) {
  const result = await authService
    .signin(req.body.id, req.body.password)
    .catch(next);
  if (!result) return new Error();
  res.cookie("jwt", result.refreshToken);
  return res.json({accessToken: result.accessToken})
}

async function authenticateAccess(req, res, next) {
  const result = await authService
    .authenticateAccess(req.get("authorization"))
    .catch(next);
  if (!result) return new Error();
  req.userId = result.payload.id;
  req.token = result.token;
  next();
}

async function logout(req, res, next) {
  const result = await authService
    .logout(req.token)
    .catch(next);
  if (!result) return new Error();
  res.json(result)
}

async function issueAccessToken(req, res, next) {
  const result = await authService
    .issueAccessToken(req.cookies?.refreshToken)
    .catch(next);
  if (!result) return new Error();
  res.json(result);
}

module.exports = {
  signup,
  signin,
  logout,
  issueAccessToken,
  authenticateAccess,
};
