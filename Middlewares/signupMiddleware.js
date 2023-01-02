const { body } = require("express-validator");

const userDataValidateChainMethod=  [
    body("name")
    .exists({ checkFalsy: true })
    .withMessage("User name is required")
    .isString()
    .withMessage("User name should be string")
    .isLength({ min: 3 })
    .withMessage("Password should be at least 3 characters"),
    body("password")
      .exists()
      .withMessage("Password is required")
      .isString()
      .withMessage("Password should be string")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters"),
      body("retype")
      .exists()
      .withMessage("Password is required")
      .isString()
      .withMessage("Password should be string")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters"),
    body("email").optional().isEmail().withMessage("Provide valid email"),
    body("number")
      .optional()
      .isString()
      .withMessage("phone number should be string")
      .custom((value) => {
        if (value.length !== 11) {
          return Promise.reject("Phone number should be 11 digits");
        } else {
          return true;
        }
      }),
  ];
  
module.exports=userDataValidateChainMethod;