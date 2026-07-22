export interface OrderConfirmationEmail {
  to: string;
  fullName: string;
  orderNumber: string;
  total: number;
}

export interface QuotationEmail {
  to: string;
  fullName: string;
  eventType: string;
  eventDate: string;
  finalPrice?: number;
  adminNotes?: string;
  status: string;
}
