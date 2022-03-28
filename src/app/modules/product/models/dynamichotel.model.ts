import { DynamicHotelImage } from './dynamichotelimage.model';
import { ProductRating } from './productrating.model';

export class DynamicHotel {
  listingId: number = null;
  tboHotelId: number;
  locationId: string;
  packageId: number;
  title: string;
  description: string;
  images: DynamicHotelImage[];
  ratings: ProductRating;
  price?: number;
  payout?: number;
  isDynamic: boolean;
}
