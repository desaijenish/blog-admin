import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../../utils/rtkHelper";

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: customBaseQuery,
  tagTypes: ["document"],
  endpoints: (builder) => ({
    getUploadDocument: builder.query({
      query: (id) => `/document/${id}`,
      providesTags: ["document"],
    }),

    uploadDocument: builder.mutation({
      query: (formData) => ({
        url: "/document/pdf",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["document"],
    }),
    uploadDocumentPng: builder.mutation({
      query: (formData) => ({
        url: "/document/png",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["document"],
    }),

    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `/document/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["document"],
    }),
  }),
});

export const {
  useGetUploadDocumentQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useUploadDocumentPngMutation,
} = documentApi;
