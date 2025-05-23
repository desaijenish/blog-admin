import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  tagTypes: ["login"],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (input) => ({
        url: `/auth/login`,
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["login"],
    }),
    registerUser: builder.mutation<void, any>({
      query: (input) => ({
        url: `/auth/register`,
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["login"],
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),
    resendOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} = loginApi;
