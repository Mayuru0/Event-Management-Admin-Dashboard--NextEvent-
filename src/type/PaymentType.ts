export interface PaymentType {
  _id: string;
  ticketId: string;
  userId: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  paymentStatus: "pending" | "success" | "failed";
  paymentMethod: string;
  eventTitle: string;
  customerName: string;
  createdAt: string;
}
