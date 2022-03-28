import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../common/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FeedbackRoutingModule } from './feedback-routing.module';

import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackcontainerComponent } from './components/feedbackcontainer/feedbackcontainer.component';
import { FeedbackformComponent } from './components/feedbackform/feedbackform.component';


@NgModule({
  declarations: [FeedbackComponent, FeedbackcontainerComponent, FeedbackformComponent],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FeedbackModule { }
