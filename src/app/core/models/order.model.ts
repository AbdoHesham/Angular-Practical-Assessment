export interface Order {
    OrderId: number;
    OrderDate: string;
    UserId: string;
    Products: { ProductId: number; Quantity: number }[];
    PaymentType: string;
  }
  