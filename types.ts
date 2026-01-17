
export enum UserRole {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  KITCHEN = 'KITCHEN',
  DELIVERY = 'DELIVERY',
  CUSTOMER = 'CUSTOMER'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image?: string;
  category: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DailyStat {
  date: string;
  count: number;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  cuisine: string;
  image: string;
  menu: MenuItem[];
  reviews: Review[];
  isFreeDelivery?: boolean;
  staff: {
    kitchenIds: string[];
    deliveryIds: string[];
  };
  // New Billing & Stats Fields
  dailyOrderCount: number;
  totalDebt: number; // Cumulative cost (count * 250)
  orderHistory: DailyStat[];
  lastResetTimestamp: string; // ISO string to track 3 AM resets
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'preparing' | 'prepared' | 'delivering' | 'delivered';

export interface Order {
  id: string;
  restaurantId: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: OrderItem[];
  notes?: string;
  total: number;
  status: OrderStatus;
  assignedDriverId?: string;
  createdAt: string;
  history: { status: OrderStatus; time: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  address?: string;
  phone?: string;
  restaurantId?: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}
