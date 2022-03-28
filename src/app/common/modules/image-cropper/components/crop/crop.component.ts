import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.css']
})
export class CropComponent implements OnInit {

  @Output() imageCropped: EventEmitter<any> = new EventEmitter();
  @ViewChild('modal', { static: false }) modal: ModalComponent;

  constructor() { }

  ngOnInit() {
  }

  addImage($event, config: CropConfig) {
    this.modal.addImage($event, config);
  }

  saveImage(image) {
    this.imageCropped.emit(image);
  }
}
