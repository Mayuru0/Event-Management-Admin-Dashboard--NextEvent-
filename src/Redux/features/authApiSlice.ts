import { apiSlice } from "../apiSlice"
import type { User, LoginCredentials, RegisterCredentials } from "@/type/user"

interface LoginResponse {
  success: boolean
  data?: {
    user: User
    token: string
  }
  message?: string
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<{ user: User; token: string }, RegisterCredentials>({
      query: (formData) => ({
        url: "/user/register",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (formData) => ({
        url: "/user/login",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),

    updateUser: builder.mutation<User, { UserId: string; formData: FormData }>({
      query: ({ UserId, formData }) => ({ 
        url: `/user/update/${UserId}`,      
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),


    updateUserStatus: builder.mutation<User, { UserId: string; status: string }>({
      query: ({ UserId, status }) => ({ 
        url: `/user/update/status/${UserId}`,      
        method: "PATCH",
        body: JSON.stringify({ status }), // Send as JSON
        headers: {
          "Content-Type": "application/json", // Ensure backend knows it's JSON
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    


   getAllUsers: builder.query<User[], void>({
  query: () => "/user/get",
  transformResponse: (response: { success: boolean; data: User[] }) => response.data,
  providesTags: ["Auth"],
}),





getUser: builder.query<User, string>({
  query: (userId) => `/user/${userId}`, 
  transformResponse: (response: { success: boolean; data: User }) => response.data,
  providesTags: ["Auth"],
})

    

  }),
 





})

export const { useRegisterMutation, useLoginMutation, useUpdateUserMutation , useGetAllUsersQuery ,useUpdateUserStatusMutation ,useGetUserQuery} = authApiSlice
