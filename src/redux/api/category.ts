import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../../utils/rtkHelper";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: customBaseQuery,
  tagTypes: ["category"],
  endpoints: (builder) => ({
    getAllCategory: builder.query<
      any,
      {
        search?: string | undefined;
      }
    >({
      query: ({ search }) => {
        const params = new URLSearchParams();
        if (search !== undefined && search.length > 0) {
          params.set("search", search);
        }
        return `category/search?skip=0&limit=100&${params.toString()}`;
      },
      providesTags: ["category"],
    }),
    getMultiCategory: builder.query({
      query: () => `/category/all`,
      providesTags: ["category"],
    }),
    getCategoryById: builder.query({
      query: (id) => `/category/${id}`,
      providesTags: ["category"],
    }),
    createCategory: builder.mutation({
      query: (input) => ({
        url: `/category/add`,
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["category"],
    }),
    UpdateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),
    removeCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
  }),
});

export const {
  useGetMultiCategoryQuery,
  useCreateCategoryMutation,
  useGetAllCategoryQuery,
  useGetCategoryByIdQuery,
  useRemoveCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi;
