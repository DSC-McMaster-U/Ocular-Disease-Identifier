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
  const API_BASE_URL = "http://localhost:8080";
  try {
      const response = await fetchData(`${API_BASE_URL}/signup`, {
          method: "POST",
          body: JSON.stringify({ email, password, confirmPassword }),
          headers: {
              "Content-Type": "application/json",
          },
      });
      const data = await response.json();
      
      if (response.ok) {
          // Return both the data and a success flag
          return { 
              success: true, 
              data 
          };
      }
      return { 
          success: false, 
          error: data.error 
      };
  } catch (error) {
      console.error("Error:", error);
      return { 
          success: false, 
          error: error instanceof Error ? error.message : "An error occurred" 
      };
  }
};



export const loginHandler = async ({ email, password }: User) => {
  const url: string = "http://localhost:8080";
  try {
      const response = await fetchData(url + "/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
              "Content-Type": "application/json",
          },
      });
      const data = await response.json();
      if (response.ok) {
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify({ email, password }));
          return { success: true, data };
      }
      return { success: false, error: data.error };
  } catch (error) {
      console.error("Error:", error);
      return { error: error };
  }
};