import { HotelImage } from './hotelimage.model';
import { Tag } from './tag.model';
import { ProductRating } from './productrating.model';

export class Hotel {
  productListingId: string;
  hotelId: number;
  listingId: number = null;
  tboHotelId: number;
  packageId: number;
  slug: string;
  locationId: string;
  title: string;
  description: string;
  images: HotelImage[];
  status: number;
  ratings: ProductRating;
  tags?: Tag[];
  price?: number;
  payout?: number;
}
