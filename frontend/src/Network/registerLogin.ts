import { User } from "../Models/user";

// Base model for fetching to API server
const fetchData = async (input: RequestInfo, init?: RequestInit) => {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;

    throw Error(
      "Request failed with status: " +
        response.status +
        " message: " +
        errorMessage
    );
  }
};

export const signUpHandler = async ({
  email,
  password,
  confirmPassword,
}: User) => {
  // Temp url for testing
  const url: string = "http://127.0.0.1:1000";
  try {
    const response = await fetchData(url + "/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, confirmPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return { error: error };
  }
};

export const loginHandler = async ({ email, password }: User) => {
  const url: string = "http://127.0.0.1:1000"; // Corrected URL
  try {
      const response = await fetchData(url + "/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
              "Content-Type": "application/json",
          },
      });
      return response.json();
  } catch (error) {
      console.error("Error:", error);
      return { error: error };
  }
};
