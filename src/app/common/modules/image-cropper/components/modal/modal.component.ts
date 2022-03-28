import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CropperComponent } from '../cropper/cropper.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Output() saveImage: EventEmitter<any> = new EventEmitter();
  @ViewChild('closeModalEl', { static: false }) closeModalEl: ElementRef;
  @ViewChild('modalLauncher', { static: false }) modalLauncher: ElementRef;
  @ViewChild('imageCropper', { static: false }) imageCropper: CropperComponent;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.modal !== 'crop') {
        this.closeModal();
      }
    });
  }

  addImage($event, config: CropConfig) {
    this.imageCropper.fileChangeEvent($event, config);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        modal: 'crop'
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
    this.modalLauncher.nativeElement.click();
  }

  closeModal() {
    if (this.closeModalEl) {
      this.closeModalEl.nativeElement.click();
    }
  }

  onSaveImage() {
    this.saveImage.emit(this.imageCropper.getImage());
    this.closeModal();
  }
}
