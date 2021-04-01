const { Sequelize, DataTypes } = require("sequelize");
const db = require("./index.js");

const User = db.define("users", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Brand = db.define("brands", {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  headquarters: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Type = db.define("types", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Collection = db.define("collections", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Model = db.define("models", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Image = db.define("images", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const SizeType = db.define("sizetype", {
  sizeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Cut = db.define("cuts", {
  cut: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Shoe = db.define("shoes", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  styleCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.NUMERIC,
    allowNull: false,
  },
  boxStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  wears: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  purchasePrice: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  description: {
    type: DataTypes.STRING(2000),
    allowNull: true,
  },
  receipt: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  collaborator: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  releaseDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  retailPrice: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sneaksId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Collection.belongsTo(Brand);
Model.belongsTo(Collection);
Model.belongsTo(Brand);
Shoe.belongsTo(Model);
Shoe.belongsTo(Brand);
Shoe.belongsTo(User);
Shoe.belongsTo(Collection);
Shoe.belongsTo(Cut);
Shoe.belongsTo(Type);
Shoe.belongsTo(SizeType);
Shoe.belongsTo(Image);

User.sync({ alter: true });

Brand.sync({ alter: true });

Type.sync({ alter: true });

Collection.sync({ alter: true });

SizeType.sync({ alter: true });

Image.sync({ alter: true });

Model.sync({ alter: true });

Cut.sync({ alter: true });

Shoe.sync({ alter: true });

module.exports = {
  User,
  Brand,
  Type,
  Collection,
  Model,
  Cut,
  Shoe,
  SizeType,
  Image,
};
