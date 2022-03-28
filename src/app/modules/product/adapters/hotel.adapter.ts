import { Injectable } from '@angular/core';
import { Hotel } from '../models/hotel.model';
import { HotelImage } from '../models/hotelimage.model';
import { ProductRating } from '../models/productrating.model';
import { Tag } from '../models/tag.model';
import { DynamicHotel } from '../models/dynamichotel.model';
import { DynamicHotelImage } from '../models/dynamichotelimage.model';

@Injectable()
export class HotelAdapter {
  constructor() { }

  adaptHotels(product: any): Hotel {
    const prodOb = new Hotel();
    prodOb.productListingId = null;
    prodOb.hotelId = product.hotel_id ? product.hotel_id : null;
    prodOb.tboHotelId = product.tbo_hotel_id ? product.tbo_hotel_id : null;
    prodOb.packageId = product.package_id ? product.package_id : null;
    prodOb.slug = product.slug ? product.slug : null;
    prodOb.locationId = null;
    prodOb.title = product.title;
    prodOb.description = product.description ? product.description : '';
    prodOb.images = this.adaptProductImages(product.images);
    prodOb.ratings = this.adaptProductRatings(product.ratings);
    prodOb.status = product.status;
    prodOb.price = product.price ? Math.ceil(product.price) : 0;
    prodOb.payout = product.payout ? Math.floor(product.payout) : 0;
    return prodOb;
  }

  adaptDynamicHotels(product: any): DynamicHotel {
    const prodOb = new DynamicHotel();
    prodOb.tboHotelId = product.tbo_hotel_id ? product.tbo_hotel_id : null;
    prodOb.packageId = product.package_id ? product.package_id : null;
    prodOb.locationId = product.location_id ? product.location_id : null;
    prodOb.title = product.title ? product.title : null;
    prodOb.description = product.description ? product.description : '';
    prodOb.images = this.adaptDynamicProductImages(product.images);
    prodOb.ratings = this.adaptProductRatings(product.ratings);
    prodOb.price = product.price ? Math.ceil(product.price) : 0;
    prodOb.payout = product.payout ? Math.floor(product.payout) : 0;
    prodOb.isDynamic = product.isDynamic ? product.isDynamic : null;
    return prodOb;
  }

  adaptProductHotels(product: any): Hotel {
    const prodOb = new Hotel();
    prodOb.productListingId = product.productlisting_id;
    prodOb.hotelId = product.hotel_id ? product.hotel_id : null;
    prodOb.packageId = product.package_id ? product.package_id : null;
    prodOb.slug = product.slug ? product.slug : null;
    prodOb.locationId = product.location_id;
    prodOb.title = product.title;
    prodOb.description = product.description ? product.description : '';
    prodOb.ratings = this.adaptProductRatings(product.ratings);
    prodOb.images = this.adaptProductImages(product.images);
    prodOb.status = product.status;
    prodOb.price = product.price ? Math.ceil(product.price) : 0;
    prodOb.payout = product.payout ? Math.floor(product.payout) : 0;
    return prodOb;
  }

  adaptProductTags(tags): Tag[] {
    if (tags.length > 0) {
      return tags.map(tag => {
        const tagOb = new Tag();
        tagOb.tagId = tag.tag_id;
        tagOb.tag = tag.tag;
        return tagOb;
      });
    }
    return [];
  }

  adaptProductRatings(rating): ProductRating {
    const ratingOb = new ProductRating();
    ratingOb.hygiene = Math.round(rating.hygiene);
    ratingOb.food = Math.round(rating.food);
    ratingOb.value = Math.round(rating.value);
    return ratingOb;
  }

  adaptProductImages(images): HotelImage[] {
    if (images.length > 0) {
      return images.map(imageOb => {
        const prodImage = new HotelImage();
        prodImage.imageId = imageOb.image_id;
        prodImage.url = encodeURI(imageOb.url.trim());
        prodImage.order = imageOb.order;
        return prodImage;
      });
    }
    return [];
  }

  adaptDynamicProductImages(images): DynamicHotelImage[] {
    if (images.length > 0) {
      return images.map(imageOb => {
        const prodImage = new DynamicHotelImage();
        prodImage.imageId = null;
        prodImage.url = images;
        prodImage.order = null;
        return prodImage;
      });
    }
    return [];
  }

  adaptFilters(filters): Tag[] {
    if (filters.length > 0) {
      return filters.map(filter => {
        const tagOb = new Tag();
        tagOb.tagId = filter.tag_id;
        tagOb.tag = filter.tag;
        tagOb.isChecked = filter.is_checked;
        return tagOb;
      });
    }
    return [];
  }
}
