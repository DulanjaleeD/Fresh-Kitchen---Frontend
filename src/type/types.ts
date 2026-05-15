export type UserRole = 'ADMIN' | 'CUSTOMER';
export type FoodStatus = 'AVAILABLE' | 'OUT_OF_STOCK';
export type OrderStatus = 'PLACED' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
}

export interface Category {
  id: number;
  name: string;
}

export interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  status: FoodStatus;
  category?: Category | null;
}

export interface BasketItem {
  id: number;
  quantity: number;
  foodItem: Food;
}

export interface Basket {
  id: number;
  items: BasketItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  foodItem: Food;
}

export interface Payment {
  id: number;
  amount: number;
  status: PaymentStatus;
}

export interface Order {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  orderItems: OrderItem[];
  payment?: Payment;
}
