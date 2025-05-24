import { ObjectId } from 'mongodb';  // Import ObjectId nếu bạn sử dụng MongoDB


interface OrderItem {
  _id: ObjectId | string;       
  name: string;
  categories:ObjectId | string;               
  price: number; 
  thumbnail:string;
  images:string;       
  quantity: number;            
  totalPrice: number;            
}

// Định nghĩa kiểu dữ liệu cho đơn hàng
export interface Order {
  _id: ObjectId | string;  
  customerId:ObjectId | string;
  name:string;
  phone:string;
  email:string;
  address: string;
  items: OrderItem[];
  deliveryStatus:string;
  priceOders:number;          
  updatedAt: string;             
}

