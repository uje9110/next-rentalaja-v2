import axios from "axios";

export async function kledo_single_auth() {
  try {
    const endpoint = `${process.env.KLEDO_HOST}/authentication/singleLogin`;
    const res = await axios.post(endpoint, {
      email: process.env.KLEDO_ACCOUNT,
      password: process.env.KLEDO_PASS,
      remember_me: 1,
      is_otp: 0,
      apple_identity_token: null,
    });
    const accessToken = res.data.data.data.access_token;
    return accessToken;
  } catch (error) {
    console.log(error);
    return error;
  }
}
