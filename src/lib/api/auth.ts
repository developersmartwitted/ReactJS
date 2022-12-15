import { createAPIFunction, Schemas } from "./connection";

const login = createAPIFunction<
  Schemas["UserLoginDto"],
  Schemas["LoginResponseDto"]
>("POST", "/api/auth/login");
const logout = createAPIFunction("POST", "/api/auth/logout");
const refresh = createAPIFunction<void, Schemas["LoginResponseDto"]>(
  "POST",
  "/api/auth/refresh"
);
const sendForgotPasswordOTP = createAPIFunction<Schemas["SendEmailDto"]>(
  "POST",
  "/api/auth/send-forgot-password-otp"
);
const verifyForgotPasswordOTP = createAPIFunction<Schemas["VerifyEmailDto"]>(
  "POST",
  "/api/auth/verify-forgot-password-otp"
);
const forgotPassword = createAPIFunction<Schemas["ForgotPasswordDto"]>(
  "POST",
  "/api/auth/forgot-password"
);
const sendEmailOTP = createAPIFunction<
  Schemas["SendEmailDto"],
  { otp: string }
>("POST", "/api/auth/send-email-otp");
const verifyEmailOTP = createAPIFunction<Schemas["VerifyEmailDto"]>(
  "POST",
  "/api/auth/verify-email-otp"
);
const sendPhoneOTP = createAPIFunction<
  Schemas["SendPhoneOtpDto"],
  { otp: number }
>("POST", "/api/auth/send-phone-otp");
const verifyPhoneOTP = createAPIFunction<Schemas["VerifyPhoneOtpDto"]>(
  "POST",
  "/api/auth/verify-phone-otp"
);
const register = createAPIFunction<
  Omit<Schemas["RegisterDto"], "invitedBy"> & { invitedBy: null }
>("POST", "/api/auth/register");
const verify = createAPIFunction<
  Schemas["VerifyDto"],
  Schemas["VerifyInfoDto"]
>("POST", "/api/auth/verify");

const acceptInvite = createAPIFunction<{ id: string }, void>(
  "POST",
  "/api/teams/accept-invite"
);

const authAPI = {
  login,
  refresh,
  logout,

  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  forgotPassword,

  sendEmailOTP,
  verifyEmailOTP,
  sendPhoneOTP,
  verifyPhoneOTP,
  register,

  verify,
  acceptInvite,
};

export { authAPI };
