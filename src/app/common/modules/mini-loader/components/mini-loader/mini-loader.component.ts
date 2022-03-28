import { Component, OnInit } from '@angular/core';
import { MiniLoaderService } from '../../services/mini-loader.service';

@Component({
  selector: 'app-mini-loader',
  templateUrl: './mini-loader.component.html',
  styleUrls: ['./mini-loader.component.css']
})
export class MiniLoaderComponent implements OnInit {

  showLoader: boolean;

  constructor(
    private mloaderService: MiniLoaderService
  ) {
    this.mloaderService.getLoaderState().subscribe(
      state => {
        this.showLoader = state;
      }
    );
  }

  ngOnInit() {
  }
}
