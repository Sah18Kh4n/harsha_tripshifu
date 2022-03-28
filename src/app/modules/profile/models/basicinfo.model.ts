import {Location} from '../models/location.model';
import {Social} from '../models/social.model';

export class BasicInfo {
  public firstname: string;
  public lastname: string;
  public dateofbirth: string;
  public salutation: string;
  public gender: string;
  public city: string;
  public headline: string;
  public about: string;
  public phone: string;
  public total_locs:number;
  public locations:Location[];
  public email:string;
  public social:Social[];
  public slug:string;

}
