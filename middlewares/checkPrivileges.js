const { Article, Comment, User, Role, Privilege } = require("../models");

async function checkPrivileges(req, res, next) {
  let privileges = await Privilege.findAll({
    where: {
      roleId: req.user.roleId,
    },
  });
  for (let indice = 0; indice < privileges.length; indice++) {
    if (privileges[indice].dataValues.name == "Create Article") {
    }
  }
  next();
}
module.exports = checkPrivileges;
/*
    para las rutas admin?
    app.delete ("/admin/articulos", [checkIfAdmin, isLoggedIn], articlesController.destroy);
*/
