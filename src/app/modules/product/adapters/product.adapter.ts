import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductImage } from '../models/productimage.model';
import { ProductRating } from '../models/productrating.model';
import { Tag } from '../models/tag.model';

@Injectable()
export class ProductAdapter {
  constructor() { }

  adaptListings(product: any): Product {
    const prodOb = new Product();
    prodOb.productListingId = null;
    prodOb.listingId = product.listing_id ? product.listing_id : null;
    prodOb.packageId = product.package_id ? product.package_id : null;
    prodOb.slug = product.slug ? product.slug : null;
    prodOb.locationId = null;
    prodOb.title = product.title;
    prodOb.property_title = product.property_title ? product.property_title: null;
    prodOb.description = product.description ? product.description : '';
    prodOb.ratings = this.adaptProductRatings(product.ratings);
    prodOb.images = this.adaptProductImages(product.images);
    prodOb.status = product.status;
    prodOb.price = product.price ? Math.ceil(product.price) : 0;
    prodOb.payout = product.payout ? Math.floor(product.payout) : 0;
    return prodOb;
  }

  adaptProductListings(product: any): Product {
    const prodOb = new Product();
    prodOb.productListingId = product.productlisting_id;
    prodOb.listingId = product.listing_id ? product.listing_id : null;
    prodOb.packageId = product.package_id ? product.package_id : null;
    prodOb.hotelId = product.hotel_id ? product.hotel_id : null;
    prodOb.tboHotelId = product.tbo_hotel_id ? product.tbo_hotel_id : null;
    prodOb.slug = product.slug ? product.slug : null;
    prodOb.locationId = product.location_id;
    prodOb.title = product.title;
    prodOb.property_title = product.property_title ? product.property_title: null;
    prodOb.description = product.description ? product.description : '';
    prodOb.ratings = this.adaptProductRatings(product.ratings);
    prodOb.images = this.adaptProductImages(product.images);
    prodOb.tags = this.adaptProductTags(product.tags);
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

  adaptProductImages(images): ProductImage[] {
    if (images.length > 0) {
      return images.map(imageOb => {
        const prodImage = new ProductImage();
        prodImage.imageId = imageOb.image_id;
        prodImage.url = encodeURI(imageOb.url.trim());
        prodImage.order = imageOb.order;
        return prodImage;
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
