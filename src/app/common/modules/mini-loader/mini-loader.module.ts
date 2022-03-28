import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniLoaderComponent } from './components/mini-loader/mini-loader.component';
import { MiniLoaderService } from './services/mini-loader.service';

@NgModule({
  declarations: [
    MiniLoaderComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    MiniLoaderService
  ],
  exports: [
    MiniLoaderComponent
  ]
})
export class MiniLoaderModule { }
