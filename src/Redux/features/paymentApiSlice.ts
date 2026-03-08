import { apiSlice } from "../apiSlice";
import { PaymentType } from "@/type/PaymentType";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPayments: builder.query<PaymentType[], void>({
      query: () => "/payment/get",
      transformResponse: (response: { success: boolean; data: PaymentType[] }) => response.data,
      providesTags: ["Payment"],
    }),

    getPaymentsByUserId: builder.query<PaymentType[], string>({
      query: (userId) => `/payment/user/${userId}`,
      transformResponse: (response: { success: boolean; data: PaymentType[] }) => response.data,
      providesTags: ["Payment"],
    }),
  }),
});

export const { useGetAllPaymentsQuery, useGetPaymentsByUserIdQuery } = paymentApiSlice;
