const { national: formatPhone } = require("libphonenumber");

const errToStatus = {
  'Unauthorized': 401,
  'jwt malformed': 401,
  'Not Found': 404,
  'No user with such id': 400,
  "Wrong password": 400,
  "Wrong params": 400,
  "Session expired": 400,
  "Failed to upload file": 400,
  "No file with such id": 400
}

const errToMessage = {
  "unauthorized": "Unauthorized",
  "jwt_malformed": "JWT malformed",
  "not_found": "Not Found",
  "user_with_such_id_does_not_exist": "No user with such id",
  "wrong_password": "Wrong password",
  "wrong_params": "Wrong params provided",
  "session_expired": "Session expired",
  "failed_to_upload": "Failed to upload file",
  "no_file_with_such_id": "No file with such id"
}

function normalizeError(err) {
  console.log(err);
  let normalizedMessage = errToMessage[err.message] || "unknown_error";
  const status = errToStatus[normalizedMessage] || 500;
  return { message: normalizedMessage, status }
}

function getFormattedId(id) {
  try {
    return formatPhone(id);
  } catch (e) {}
  const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(id);
  if (isEmail) return id.toLowerCase();
  return null;
}

function formatId(req, res, next) {
  const formatted = getFormattedId(req.body.id);
  req.id = formatted;
  if (formatted !== null) return next();
  throw new Error("wrong_params");
}

module.exports = {
  formatId,
  normalizeError
}
