import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../../utils/rtkHelper";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: customBaseQuery,
  tagTypes: ["blog"],
  endpoints: (builder) => ({
    getAllBlog: builder.query<
      any,
      {
        search?: string;
        category_id?: number;
        slug?: string;
      }
    >({
      query: ({ search, category_id, slug }) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category_id) params.set("category_id", category_id.toString());
        if (slug) params.set("code", slug);
        return `blog/search?skip=0&limit=100&${params.toString()}`;
      },
      providesTags: ["blog"],
    }),
    getBlogById: builder.query({
      query: (id) => `/blog/${id}`,
      providesTags: ["blog"],
    }),
    createBlog: builder.mutation({
      query: (input) => ({
        url: `/blog/add`,
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["blog"],
    }),
    UpdateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),
    removeBlog: builder.mutation({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),
    uploadImagePng: builder.mutation({
      query: (formData) => ({
        url: "/images/png",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["blog"],
    }),

    deleteImage: builder.mutation({
      query: (id) => ({
        url: `/images/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useGetAllBlogQuery,
  useGetBlogByIdQuery,
  useRemoveBlogMutation,
  useUpdateBlogMutation,
  useUploadImagePngMutation,
  useDeleteImageMutation,
} = blogApi;
