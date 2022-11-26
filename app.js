const express = require("express");
const Joi = require("joi");
const app = express();
const cors = require("cors");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

/*********MIDDLEWARE**********/

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

/*********ROUTES**********/

const products = [
  {
    id: "1",
    name: "/ Tuxedo jacket with lapels",
    price: 23900,
    details: "Product details: Emphasizes the waistline",
    featured: true,
    productImage: "uploads/product-image-1.png",
  },

  {
    id: "2",
    name: "/ Blouse with peplum",
    price: 21800,
    details: "Product details: Emphasizes the waistline",
    featured: true,
    productImage: "uploads/product-image-15.png",
  },
  {
    id: "3",
    name: "/ White tuxedo jacket",
    price: 26900,
    details: "Product details: Emphasizes the waistline",
    featured: true,
    productImage: "uploads/product-image-3.png",
  },

  {
    id: "4",
    name: "/ Straight tuxedo jacket",
    price: 27500,
    details: "Product details: Emphasizes the waistline",
    featured: true,
    productImage: "uploads/product-image-5.png",
  },
  {
    id: "5",
    name: "/ Velvet tuxedo jacket",
    price: 29500,
    details: "Product details: Emphasizes the waistline",
    featured: true,
    productImage: "uploads/product-image-19.png",
  },
  {
    id: "6",
    name: "/ Tuxedo jacket",
    price: 21800,
    details: "Product details: Emphasizes the waistline",
    featured: true,
    productImage: "uploads/product-image-18.png",
  },
  {
    id: "7",
    name: "/ Tuxedo jacket",
    price: 21900,
    details: "Product details: Emphasizes the waistline",
    featured: true,
    productImage: "uploads/product-image-11.png",
  },

  {
    id: "8",
    name: "/ Flared trousers",
    price: 26900,
    details: "Product details: Emphasizes the waistline",
    featured: false,
    productImage: "uploads/product-image-10.png",
  },
  {
    id: "9",
    name: "/ Classic set with tuxedo and vest",
    price: 65300,
    details: "Product details: world classic",
    featured: true,
    productImage: "uploads/product-image-2.png",
  },
  {
    id: "10",
    name: "/ Tuxedo dress long",
    price: 25800,
    details: "Product details: Emphasizes the waistline",
    featured: false,
    productImage: "uploads/product-image-9.png",
  },
  {
    id: "11",
    name: "/ White tuxedo and trousers with stripes",
    price: 24600,
    details: "Product details: Emphasizes the waistline",
    featured: true,
    productImage: "uploads/product-image-10.png",
  },
  {
    id: "12",
    name: "/ Classic set with butterfly",
    price: 24600,
    details: "Product details: Emphasizes the waistline",
    featured: true,
    productImage: "uploads/product-image-11.png",
  },
  {
    id: "13",
    name: "/ White tuxedo with flared trousers",
    price: 40400,
    details: "Product details: Emphasizes the waistline",
    featured: true,
    productImage: "uploads/product-image-6.png",
  },
  {
    id: "14",
    name: "/ Jacket - tuxedo fitted blue",
    price: 26900,
    details: "Product details: Emphasizes the waistline",
    featured: false,
    productImage: "uploads/product-image-7.png",
  },
  {
    id: "15",
    name: "/ Jacket - tuxedo fitted blue",
    price: 26900,
    details: "Product details: Emphasizes the waistline",
    featured: true,
    productImage: "uploads/product-image-9.png",
  },
  {
    id: "16",
    name: "/ Jacket - tuxedo fitted blue",
    price: 26900,
    details: "Product details: Emphasizes the waistline",
    featured: false,
    productImage: "uploads/product-image-3.png",
  },
];

/***********************************************************/
/********* GET: ALL PRODUCTS **********/
/***********************************************************/

app.get("/api/products", (req, res) => {
  res.send(products);
});

/***********************************************************/
/********* GET: SINGLE PRODUCT **********/
/***********************************************************/

app.get("/api/products/:id", (req, res) => {
  const product = products.find((product) => product.id === req.params.id);
  if (!product) {
    return res.status(404).send("Product with given id was not found");
  }
  res.send(product);
});

/***********************************************************/
/********* POST: ADD PRODUCT **********/
/***********************************************************/

app.post("/api/products", upload.single("productImage"), (req, res) => {
  //validate product
  const { error } = validateProduct({
    ...req.body,
    productImage: req.file?.path,
  });

  if (error) return res.status(400).send(error);

  const product = {
    id: uuidv4(),
    name: req.body.name,
    details: req.body.details,
    price: req.body.price,
    featured: req.body.featured,
    productImage: req.file.path,
  };

  products.push(product);
  res.send(product);
});

/***********************************************************/
/********* PUT: UPDATE PRODUCT **********/
/***********************************************************/

app.put("/api/products/:id", upload.single("productImage"), (req, res) => {
  //Find product
  const product = products.find((product) => product.id === req.params.id);
  if (!product) {
    return res.status(404).send("Product with given id was not found");
  }

  const { error } = validateUpdateProduct({
    ...req.body,
  });

  if (error) return res.status(400).send(error);

  product.name = req.body.name;
  product.details = req.body.details;
  product.price = req.body.price;
  product.featured = req.body.featured;
  if (req.file) {
    product.productImage = req.file.path;
  }

  res.send(product);
});

/***********************************************************/
/********* DELETE: DELETE PRODUCT **********/
/***********************************************************/

app.delete("/api/products/:id", (req, res) => {
  const product = products.find((product) => product.id === req.params.id);
  if (!product) {
    return res.status(404).send("Product with given id was not found");
  }
  const index = products.indexOf(product);
  products.splice(index, 1);

  res.send(products);
});

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    details: Joi.string().min(3).max(200).required(),
    price: Joi.number().required(),
    featured: Joi.boolean().required(),
    productImage: Joi.string().required(),
  });

  return schema.validate(product);
}

function validateUpdateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    details: Joi.string().min(3).max(200).required(),
    price: Joi.number().required(),
    featured: Joi.boolean().required(),
    productImage: Joi.string(),
  });

  return schema.validate(product);
}

/********* PORT **********/
//To set PORT run set/export PORT=YOUR_VALUE
const PORT = process.env.PORT || 3200;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
