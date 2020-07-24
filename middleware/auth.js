const jwt = require("jsonwebtoken");
const config = require("config");


module.exports = (req, res, next) =>{
  const token = req.header("auth-token");

  if(!token){
    return res.status(401).json({msg:"No token, authrolizatoin denied"});
  }

  try{
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
  }catch(err){

  }

}
