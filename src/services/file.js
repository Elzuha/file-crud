const fs = require("fs");

const File = require("../db").File;

const FILE_UPLOADS_PATH = "./uploads";

async function createFile(file) {
  const fileRow = await File.create({
    name: file.name,
    extension: file.name.split(".").pop(),
    mimetype: file.mimetype,
    size: file.size / 1024 / 1024,
  }).catch((err) => {
    throw new Error("failed_to_upload");
  });
  console.log({fileRow})
  await saveFile(fileRow.id, fileRow.extension, file.data);
  return {ok: true};
}

async function list(listSize, page) {
  listSize = +listSize;
  const result = await File.findAndCountAll({
    offset: listSize * (page - 1),
    limit: listSize,
  })
  return result.rows
}

async function remove(id) {
  const { extension } = await getById(id);
  await removeFile(`${FILE_UPLOADS_PATH}/${id}.${extension}`);
  await File.destroy({ where: { id } });
  return {ok: true};
}

async function getFileData(id) {
  const { extension, name } = await getById(id);
  return {
    path: `${FILE_UPLOADS_PATH}/${id}.${extension}`,
    name
  };
}

async function update(id, file) {
  const extension = file.name.split(".").pop();
  await File.update({
      name: file.name,
      extension,
      mimetype: file.mimetype,
      size: file.size / 1024 / 1024,
    },
    { where: { id } }
  );
  await saveFile(id, extension, file.data);
  return {ok: true}
}

function createFilesDir() {
  return new Promise(async (resolve) => {
    fs.readdir(FILE_UPLOADS_PATH, async (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          fs.mkdirSync(FILE_UPLOADS_PATH);
          return resolve();
        } else throw err;
      }
      resolve();
    });
  });
}

function saveFile(id, extension, data) {
  return new Promise((resolve) =>
    fs.writeFile(
      `${FILE_UPLOADS_PATH}/${id}.${extension}`,
      data,
      null,
      async (err) => {
        if (err) throw err;
        resolve();
      }
    )
  );
}

function removeFile(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function getById(id) {
  const file = await File.findOne({ where: { id } });
  if (!file) throw new Error("no_file_with_such_id");
  return file;
}

module.exports = {
  createFile,
  list,
  remove,
  getById,
  getFileData,
  update,
  createFilesDir,
};
