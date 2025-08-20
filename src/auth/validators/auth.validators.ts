import { email, z } from "zod";
const registerValidator = {
  body: z.object({
    name: z.string().min(3).max(20),
    email: z.email(),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters long" })
      .max(16, { error: "Password must be at most 16 characters long" })
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/,
        {
          error:
            "Password must contain at least one uppercase letter, one lowercase letter, number and one special character.",
        }
      ),
  }),
};

const verifyEmailValidator = {
  params: z.object({
    token: z.string(),
  }),
};

const loginValidator = {
  body: registerValidator.body.pick({ email: true, password: true }),
};

export { registerValidator, verifyEmailValidator, loginValidator };
