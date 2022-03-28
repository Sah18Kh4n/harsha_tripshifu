import { Component, OnInit } from '@angular/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomePageComponent implements OnInit {

  public config: SwiperConfigInterface = {
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
  constructor() { }

  ngOnInit(): void {
    if (window.innerWidth < 768 && window.innerWidth > 575) {
      this.config.slidesPerView = 1;
    }
    if (window.innerWidth < 575) {
      this.config.slidesPerView = 1;
    }
  }

}
