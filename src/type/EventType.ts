export interface Event {
  _id: string;
  title: string;
  ticket_price: number;
  description: string;
  date: string;
  event_type:  string;
  image: string | null;
  location: string;
  organizerid?: string;  
  popularity: number;
  quantity: number;
  createdAt?: string;  
  updatedAt?: string; 
  status:string;
  
}

  
  export interface EventResponse {
    success: boolean;
    data: Event;
  }
  