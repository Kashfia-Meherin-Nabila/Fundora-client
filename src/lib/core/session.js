// import { authClient } from "@/lib/auth-client";

import { authClient } from "@/app/lib/auth-client";

export const getUserToken = async () => {
  try {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      console.error("Failed to get Better Auth token:", error);
      return null;
    }

    return data.token;
  } catch (error) {
    console.error("Get user token error:", error);
    return null;
  }
};