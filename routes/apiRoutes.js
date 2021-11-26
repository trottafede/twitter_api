const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");
const checkJwT = require("../middlewares/checkJwT");

router.get("/", (req, res) => {
  res.send("Page made by Federico Trotta");
});
router.post("/tokens", apiController.storeLogin);
router.post("/users/store", apiController.storeSignup);

router.use(checkJwT);
router.get("/api", apiController.index); // Muesta el home, lista las cosas (render)

router.get("/likes/update/:tweetId", apiController.update); // [PUT] o [PATCH] Retorna un redirect. Actualiza algo de la DB
router.get("/likes/destroy/:tweetId", apiController.destroy); // Borra un articulo de la DB. Retorna un redirect.

router.post("/tweets/store", apiController.store); // Es un post, postea lo que se creo en create (redirect)

router.get("/users/:username", apiController.show); // Muestra uno solo. (render)
router.post("/users/:username", apiController.update); // [PUT] o [PATCH] Retorna un redirect. Actualiza algo de la DB
router.get("/users/following/:username", apiController.storeFollow); // Borra un articulo de la DB. Retorna un redirect.
router.get(
  "/users/destroyFriendship/:username",
  apiController.destroyFriendship
); // Borra un articulo de la DB. Retorna un redirect.

module.exports = router;
