import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { MyContext } from "../context/MyContext";

// Authentication for routes/resolvers
// This function is parsed to the useMiddelware funciton in the resolver
export const isAuth: MiddlewareFn<MyContext> = ({context}, next) => {
  // Read the header and assign to authorization variable
  const authorization = context.req.headers['authorization'];
  // If no header then user is not authenticated : throw error
  if(!authorization) {
    throw new Error("User not authenticated");
  }
try {
  // Find the token from the header : 
  // Split() will split "Bearer" from the token eg : "Bearer keafedfsdsa"
  const token = authorization.split(" ")[1];
  // verify that the token in the header is correct
  const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
  // set the payload in the token to the context so we can access it in the resolver
  context.payload = payload as any;
} catch (err) {
  throw new Error("User not authenticated");
}
  return next();
};