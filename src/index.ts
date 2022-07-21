import express from "express";
import router from "./routers";
import expressJSDocSwagger from "express-jsdoc-swagger";

const app = express();

const options = {
  info: {
    version: "1.0.0",
    title: "Albums store",
    license: {
      name: "MIT",
    },
  },
  security: {
    BearerAuth: {
      type: "http",
      scheme: "bearer",
    },
  },
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: "./**/*.ts",
  // URL where SwaggerUI will be rendered
  swaggerUIPath: "/api-docs",
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: "/v3/api-docs",
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  multiple: true,
};

app.use(express.json());
app.use(router);
expressJSDocSwagger(app)(options);

app.listen(8000, () =>
  console.log(`
Server ready at: http://localhost:8000`)
);
