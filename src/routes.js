const express = require("express");
const router = express.Router();
const formatting = require("./formatting");
const authController = require("./controllers/auth");
const fileController = require("./controllers/file");

router.use([
  "/signup",
  new RegExp("/signin/(?!.*(new_token)).*$")
], formatting.formatId)

router.use([
  "/logout",
  "/file",
  "/info",
], authController.authenticateAccess);

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/signin/new_token", authController.issueAccessToken);
router.post("/logout", authController.logout);
router.post("/file/upload", fileController.acceptFile, fileController.upload);
router.put(
  "/file/update/:id",
  fileController.acceptFile,
  fileController.update
);
router.get("/file/list", fileController.list);
router.delete("/file/delete/:id", fileController.remove);
router.get("/file/:id", fileController.getById);
router.get("/file/download/:id", fileController.download);
router.get("/info", (req, res) => res.send(req.userId));

module.exports = router;
