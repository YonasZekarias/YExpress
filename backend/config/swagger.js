import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Ecommerce API",
    description: "Auto generated"
  },
  host: "localhost:5000",
  schemes: ["http"]
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
