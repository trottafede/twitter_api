const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");
const checkJwT = require("../middlewares/checkJwT");

router.post("/tokens", apiController.storeLogin);
router.post("/users/store", apiController.storeSignup);

router.use(checkJwT);
router.get("/timeline", apiController.index); // Muesta el home, lista las cosas (render)

router.patch("/likes/:tweetId", apiController.updateLike); // [PUT] o [PATCH] Retorna un redirect. Actualiza algo de la DB
router.delete("/likes/:tweetId", apiController.destroyLike); // Borra un articulo de la DB. Retorna un redirect.

router.post("/tweets", apiController.storeTweet); // Es un post, postea lo que se creo en create (redirect)

router.get("/users/:username", apiController.show); // Muestra uno solo. (render)
router.patch("/users/:username", apiController.updateUser); // [PUT] o [PATCH] Retorna un redirect. Actualiza algo de la DB
router.patch("/users/following/:username", apiController.storeFollow);
router.delete(
  "/users/destroyFriendship/:username",
  apiController.destroyFriendship
); // Borra un articulo de la DB. Retorna un redirect.

module.exports = router;
