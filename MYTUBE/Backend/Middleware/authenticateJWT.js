import jwt from "jsonwebtoken";

export default function authenticateJWT(req, res, next){
  const tokenWithBearer = req.header('Authorization');
  const token = tokenWithBearer.split(" ")[1];
  if (token) {
    jwt.verify(token, "MyTube", (err, user) => {
      if (err) {
        return res.send({tokenExpiredMessage:'Token expired'});
      }
      req.user = user;
      next();
    });
  } else {
    res.send({unauthorizedMessage : 'LogIn first'});
  }
};