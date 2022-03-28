import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestionComponent } from './components/suggestion/suggestion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    SuggestionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SuggestionComponent
  ]
})
export class SuggestModule { }
