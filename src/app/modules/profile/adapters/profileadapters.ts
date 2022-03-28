import { BasicInfo } from '../models/basicinfo.model';
import { Location } from '../models/location.model';
import { Social } from '../models/social.model';

export class ProfileAdapter {

  constructor() { }

  adaptProfile(item: any): BasicInfo {
    const objprofile = new BasicInfo();
    objprofile.firstname = item.firstname;
    objprofile.lastname = item.lastname;
    objprofile.slug = item.slug;
    objprofile.gender = item.gender;
    objprofile.dateofbirth = item.dateofbirth;
    objprofile.city = item.city;
    objprofile.phone = item.phone;
    objprofile.about = item.about;
    objprofile.headline = item.headline;
    objprofile.email = item.email;
    objprofile.total_locs = item.total_locs;
    objprofile.locations = this.adaptlocations(item.locations);
    objprofile.social = this.adaptsocial(item.social);
    return objprofile;
  }

  adaptlocations(locations): Location[] {
    const locationsarray = new Array();
    if (locations) {
      locations.map(location => {
        const objlocation = new Location();
        objlocation.label = location.label;
        objlocation.latlng = location.latlng;
        objlocation.influencerlocation_id = location.influencerlocation_id;
        locationsarray.push(objlocation);
      });
    }
    return locationsarray;
  }

  adaptsocial(socials): Social[] {
    const socialarray = new Array();
    if (socials) {
      socials.map(social => {
        const objsocial = new Social();
        if (social.platform === objsocial.facebook) {
          objsocial.facebook = socials.facebook;
        } else if (social.platform === objsocial.youtube) {
          objsocial.youtube = socials.youtube;
        } else if (social.platform === objsocial.snapchat) {
          objsocial.snapchat = socials.snapchat;
        } else if (social.platform === objsocial.twitter) {
          objsocial.twitter = socials.twitter;
        } else if (social.linkedin === objsocial.linkedin) {
          objsocial.linkedin = socials.linkedin;
        } else if (social.platform === objsocial.pinterest) {
          objsocial.pinterest = socials.pinterest;
        }
        socialarray.push(objsocial);
      });
    }
    return socialarray;
  }
}
