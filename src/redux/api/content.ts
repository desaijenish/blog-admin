// services/apis/contentApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../../utils/rtkHelper";

export const contentApi = createApi({
  reducerPath: "contentPageApi",
  baseQuery: customBaseQuery,
  tagTypes: ["ContentPage"],
  endpoints: (builder) => ({
    // ✅ Get content page by blog_id
    getContentById: builder.query<any, number>({
      query: (blog_id) => `/content-page/${blog_id}`,
      providesTags: ["ContentPage"],
    }),

    // ✅ Create a new content page
    createContent: builder.mutation<
      any,
      { blog_id: number; input: { name: string; contain: string } }
    >({
      query: ({ blog_id, input }) => ({
        url: `/content-page/add/${blog_id}`,
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["ContentPage"],
    }),

    // ✅ Update existing content page
    updateContent: builder.mutation<
      any,
      { blog_id: number; data: { name?: string; contain?: string } }
    >({
      query: ({ blog_id, data }) => ({
        url: `/content-page/${blog_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ContentPage"],
    }),

    // ✅ Delete content page by blog_id
    removeContent: builder.mutation<any, number>({
      query: (blog_id) => ({
        url: `/content-page/${blog_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ContentPage"],
    }),
  }),
});

export const {
  useGetContentByIdQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
  useRemoveContentMutation,
} = contentApi;
