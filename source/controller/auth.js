require("dotenv").config();
const models = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const accToken = process.env.ACCESS_TOKEN_SECRET;
const refToken = process.env.REFRESH_TOKEN_SECRET;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUsers = await models.getAllbyEmail({ email });
    // const otherUsers = await models.getNotLikeAllUsers({ email });

    if (!foundUsers.length) {
      throw { code: 401, message: `Incorrect Email or Password` };
    } else {
      if (await bcrypt.compare(password, foundUsers[0]?.password)) {
        try {
          const accessToken = jwt.sign(
            {
              id: foundUsers[0]?.users_id,
              name: foundUsers[0]?.username,
              iat: new Date().getTime(),
              seller_id: foundUsers[0]?.seller_id,
            },
            accToken,
            { expiresIn: "2000s" }
          );

          res.json({
            message: `Success, User ${foundUsers[0].username} is logged in!`,
            data: {
              accessToken,
              profilePicture: foundUsers[0]?.profile_picture,
              username: foundUsers[0]?.username,
              email: foundUsers[0]?.email,
              users_id: foundUsers[0]?.users_id,
              phoneNumber: foundUsers[0]?.phone_number,
              seller_id: foundUsers[0]?.seller_id,
            },
          });
        } catch (error) {
          res.status(error?.code ?? 500).json({
            message: error,
          });
        }
      } else {
        throw { code: 401, message: "Incorrect Email or Password" };
      }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

module.exports = { login };
