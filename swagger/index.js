import swaggerJsdoc from "swagger-jsdoc";
//everything available on swagger jsdoc
const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors.
  definition: {
    openapi: "3.0.0",
    servers: [
      {
        url: `${process.env.SERVER_URL}/api/v1`,
      },
    ],
    info: {
      title: "Bootcamp Management System",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          schema: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["routes/*.js"], // files containing annotations as above
};

export default swaggerJsdoc(options);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a user.
 *     tags: [User]
 *     requestBody:
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           example:
 *             name: Nirajan Kunwor
 *             email: nk@gmail.com
 *             password: Test1234
 *     responses:
 *       200:
 *         description: User Created Successfully
 *       400:
 *         description: User not found
 */
