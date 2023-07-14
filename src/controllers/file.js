const fileUpload = require("express-fileupload");

const fileService = require("../services/file");

async function upload(req, res, next) {
  if (!req.files) return next(new Error("no_file"));
  const result = await fileService
    .createFile(Object.values(req.files)[0])
    .catch(next);
  console.log({result})
  if (!result) return new Error();
  res.json(result);
}

async function list(req, res, next) {
  const result = await fileService
    .list(req.query["list_size"] || 10, req.query["page"] || 1)
    .catch(next);
  if (!result) return new Error();
  res.json(result);
}

async function remove(req, res, next) {
  const result = await fileService
    .remove(req.params.id)
    .catch(next);
  if (!result) return new Error();
  res.json(result);
}

async function getById(req, res, next) {
  const result = await fileService
    .getById(req.params.id)
    .catch(next);
  if (!result) return new Error();
  res.json(result);
}

async function download(req, res, next) {
  const result = await fileService
    .getFileData(req.params.id)
    .catch(next);
  if (!result) return new Error();
  res.download(result.path, result.name);
}

async function update(req, res, next) {
  const result = await fileService
    .update(req.params.id, Object.values(req.files)[0])
    .catch(next);
  if (!result) return new Error();
  res.json(result);
}

const acceptFile = fileUpload({
  defCharset: "utf8",
  defParamCharset: "utf8",
});

module.exports = {
  upload,
  list,
  remove,
  getById,
  download,
  update,
  acceptFile
};
