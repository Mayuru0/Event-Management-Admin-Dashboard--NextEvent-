import { apiSlice } from "../apiSlice";
import { Event, EventResponse } from "@/type/EventType";

export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation<Event, FormData>({
      query: (formData) => ({
        url: "/event/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Event"],
    }),

    getAllEvents: builder.query<Event[], void>({
      query: () => "/event/get",
      providesTags: ["Event"],
    }),

    getEventById: builder.query<EventResponse, string>({
      query: (eventId) => `/event/get/${eventId}`,
      providesTags: ["Event"],
    }),

    updateEvent: builder.mutation<Event, { eventId: string; formData: FormData }>({
      query: ({ eventId, formData }) => ({
        url: `/event/update/${eventId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Event"],
    }),

    deleteEvent: builder.mutation<void, string>({
      query: (eventId) => ({
        url: `/event/delete/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),

    getEventsByOrganizerid: builder.query<Event[], string>({
      query: (organizerId) => `/event/${organizerId}`,
      providesTags: ["Event"],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetEventsByOrganizeridQuery,
} = eventApiSlice;
