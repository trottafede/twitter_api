const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(process.env.MONGODB_CONNECTION);

  mongoose.connection
    .once("open", () =>
      console.log("¡Conexión con la base de datos establecida!")
    )
    .on("error", (error) => console.log(error));
};
