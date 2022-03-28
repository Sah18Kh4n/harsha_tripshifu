import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.css']
})
export class CropperComponent implements OnInit {

  cropConfig: CropConfig;
  croppedImage: any;
  imageChangedEvent: any;
  @ViewChild('imageCropper', { static: true }) imageCropper: ImageCropperComponent;

  constructor() { }

  ngOnInit() {
    this.cropConfig = {
      width: 180,
      aspectRatio: 1 / 1,
      round: false,
      type: 'avatar'
    };
  }

  fileChangeEvent(event: any, config: CropConfig): void {
    this.cropConfig = config;
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  getImage() {
    const image = this.getBlob(this.croppedImage);
    return {
      file: image,
      dataURI: this.croppedImage,
      type: this.cropConfig.type
    };
  }

  getBlob(dataURI) {
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }
}
