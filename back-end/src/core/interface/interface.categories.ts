import { Types } from 'mongoose';

export enum CategoryStatus {
  ACTIVE = 1,
  INACTIVE = 0
}

export interface CreateCategoryCreateInterface {
  id?: Types.ObjectId;  // `id` là tùy chọn
  name: string;  // `name` là bắt buộc
  slug?: string;  // `slug` là tùy chọn
  status?: CategoryStatus;  // `status` là tùy chọn
  description?: string;  // `description` là tùy chọn
}
