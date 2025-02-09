export interface Order {
    userId: string;
    products: { productId: string; quantity: number }[];
    totalCost: number;
    address: string;
    phone: string;
  }
  
