import jwt from "jsonwebtoken";

const decodeToken = (request) => {
  try {
    const token = request.cookies.get("jwt").value;
    if (token) {
      if (jwt.verify(token, process.env.JWT_TOKEN_SECRET)) {
        return jwt.decode(token, process.env.JWT_TOKEN_SECRET);
      }
    }
    return {};
  } catch (err) {
    return {};
  }
};

const checkSession = (request) => {
  try {
    const token = request.cookies.get("jwt").value;
    if (token) {
      if (jwt.verify(token, process.env.JWT_TOKEN_SECRET)) {
        return jwt.decode(token, process.env.JWT_TOKEN_SECRET);
      }
    }
    throw new Error("Invalid Session!!!");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export { decodeToken, checkSession };
