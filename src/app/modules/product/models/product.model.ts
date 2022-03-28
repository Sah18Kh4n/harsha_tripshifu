import { ProductImage } from './productimage.model';
import { ProductRating } from './productrating.model';
import { Tag } from './tag.model';

export class Product {
  productListingId: string;
  listingId: number;
  packageId: number;
  hotelId: number;
  tboHotelId: number;
  slug: string;
  locationId: string;
  title: string;
  property_title: string;
  description: string;
  ratings: ProductRating;
  images: ProductImage[];
  tags: Tag[];
  status: number;
  price: number;
  payout: number;
}
