import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Tag } from '../../models/tag.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() filters: any;
  @Output() filterListings: EventEmitter<Tag[]> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggleFilter(tagId: number): void {
    const tags = this.filters.tags.map(filter => {
      if (filter.tagId === tagId) {
        filter.isChecked = filter.isChecked ? false : true;
      } else {
        filter.isChecked = false;
      }
      return filter;
    });
    this.filters.tags = tags;
    this.filterListings.emit(this.filters);
  }

  checkFilter(tag) {
    if (tag.isChecked === true) {
      return 'active';
    }
    return '';
  }

}
