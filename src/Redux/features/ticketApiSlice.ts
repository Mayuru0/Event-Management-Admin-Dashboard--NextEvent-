import { apiSlice } from "../apiSlice";
import {TicketType} from "../../type/TicketType";

export const ticketApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTickets: builder.query<TicketType[], void>({
            query: () => "/ticket/get",
            providesTags: ["Ticket"],
        }),
        createTicket: builder.mutation<TicketType, TicketType>({
            query: (ticket) => ({
                url: "/ticket/add",
                method: "POST",
                body: ticket,
            }),
            invalidatesTags: ["Ticket"],
        }),

        getTicketsUserId: builder.query<TicketType[], string>({
            query: (userId) => `/ticket/${userId}`,
            providesTags: ["Ticket"],
        }),


        getTicketsorganizerId: builder.query<TicketType[], string>({
            query: (organizerId) => `/ticket/customer/${organizerId}`,
            providesTags: ["Ticket"],
        }),
        createCheckoutSession: builder.mutation<TicketType, TicketType>({
            query: (ticket) => ({
              url: "/ticket/create-checkout-session",
              method: "POST",
              body: ticket,
            }),
            invalidatesTags: ["Ticket"],
          }),

        updateTicket: builder.mutation<TicketType, { ticketId: string; status: string }>({
            query: ({ ticketId, status }) => ({
                url: `/ticket/${ticketId}`,
                method: "PUT",
                body: { status },
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["Ticket"],
        }),

        deleteTicket: builder.mutation<void, string>({
            query: (ticketId) => ({
                url: `/ticket/delete/${ticketId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Ticket"],
        }),
        }),
});

export const {
    useGetTicketsQuery,
    useCreateTicketMutation,
    useGetTicketsUserIdQuery,
    useGetTicketsorganizerIdQuery,
    useCreateCheckoutSessionMutation,
    useUpdateTicketMutation,
    useDeleteTicketMutation,
} = ticketApiSlice;