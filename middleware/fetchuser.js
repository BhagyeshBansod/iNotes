import jwt from "jsonwebtoken";
const sectoken = "iNotebookUser";

const fetchuser = (req, res, next) => {
    
  const token = req.header("authToken");
  
  if (!token) {
    res.status(401).send({ error: "Please authenticate using correct token" });
  }
  
  try {

    //verifying the token with the present token
    const data = jwt.verify(token, sectoken);
    req.user = data.user;
    next();

  } catch (error) {
    res.status(401).send({ error: "Please authenticate using correct token" });
  }
  
};

export default fetchuser;
