import jwt, { Secret } from "jsonwebtoken";

interface IActivationTokenBody {
  token: string;
  activationCode: string;
}

export const gernateActivationToken = (user: any): IActivationTokenBody => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};
