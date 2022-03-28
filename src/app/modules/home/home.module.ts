import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../common/shared/shared.module';
import { HomePageModule } from './homepage-routing.module';
import { HomePageComponent } from './components/homepage/homepage.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
//import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 3,
  centeredSlides: false,
  loop:false,
  spaceBetween:10,
  autoplay:false,
  keyboard:false,
  navigation:true,
  pagination:{
    el:'swiper-pagination',
    type:'bullets',
    clickable:true
  },

  hashNavigation:false,
  effect:'slide'
};

@NgModule({
  declarations: [HomePageComponent],
  
  imports: [
    CommonModule,
    HomePageModule,
    SharedModule,
    SwiperModule
  ],
  /*providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]*/
})
export class HomeModule { }
