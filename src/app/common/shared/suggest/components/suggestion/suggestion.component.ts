import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef, ViewChildren, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnInit, OnChanges {

  @Input() data: any;
  @Input() textBoxClass: string;
  @Input() config: any;
  @Output() type: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();
  defaultConfig: any;
  query: FormControl;
  placeholder: string;
  configured: boolean;
  initOnClick: boolean;
  subject: Subject<any> = new Subject();

  constructor(
    private elementRef: ElementRef
  ) {
    this.query = new FormControl({ value: null, disabled: false });
    this.defaultConfig = {
      location: null,
      disabled: false,
      initOnClick: false
    };
    this.configured = false;
  }

  ngOnInit() {
    this.subject
      .debounceTime(400)
      .subscribe(() => {
        this.type.emit({ keyword: this.query.value });
      });
  }

  ngOnChanges() {
    this.configure();
  }

  configure() {
    this.placeholder = '';
    if (this.config) {
      if (this.config.location !== null && this.config.location !== undefined && this.configured === false) {
        this.configured = true;
        this.query.setValue(this.config.location);
      }
      if (this.config.disabled !== null && this.config.disabled !== undefined && this.config.disabled === true) {
        this.query.disable();
      }
      if (this.config.placeholder) {
        this.placeholder = this.config.placeholder;
      }
      if (this.config.initOnClick) {
        this.initOnClick = this.config.initOnClick;
      } else {
        this.initOnClick = this.defaultConfig.initOnClick;
      }
    }
  }

  inputChange() {
    this.subject.next();
  }

  onFocus() {
    if (this.initOnClick === true) {
      this.inputChange();
    }
  }

  setInput(entity) {
    if (entity.disabled) {
      return;
    }
    this.query.reset(entity.value);
    this.data = [];
    this.selected.emit({ selected: entity });
  }

  finishedTyping() {
    this.data = [];
    if (this.query.value === '') {
      this.selected.emit({ location: '' });
    }
  }

  clearInput() {
    this.query.setValue('');
  }

  @HostListener('document:click', ['$event'])
  clickedOutside($event) {
    if (!this.elementRef.nativeElement.contains($event.target)) {
      this.data = undefined;
    }
  }
}
