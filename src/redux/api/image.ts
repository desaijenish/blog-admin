// imagesApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../../utils/rtkHelper";

export const imagesApi = createApi({
  reducerPath: "imagesApi",
  baseQuery: customBaseQuery,
  tagTypes: ["images"],
  endpoints: (builder) => ({
    getUploadImages: builder.query({
      query: (blog_id) => `/images/${blog_id}`,
      providesTags: ["images"],
    }),
    uploadImage: builder.mutation({
      query: ({ blog_id, formData }) => ({
        url: `/images/png/${blog_id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["images"],
    }),
    deleteImage: builder.mutation({
      query: (id) => ({
        url: `/images/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["images"],
    }),
    updateImage: builder.mutation({
      query: ({ image_id, formData }) => ({
        url: `/images/${image_id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["images"],
    }),
  }),
});

export const {
  useGetUploadImagesQuery,
  useDeleteImageMutation,
  useUploadImageMutation,
  useUpdateImageMutation,
} = imagesApi;
