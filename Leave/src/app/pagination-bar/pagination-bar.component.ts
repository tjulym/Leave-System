import { Component, OnInit, Input, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { PaginationConf } from '../domain/paginationConf';


@Component({
  selector: 'app-pagination-bar',
  templateUrl: './pagination-bar.component.html',
  styleUrls: [
    './pagination-bar.component.css'
  ]
})
export class PaginationBarComponent implements OnInit {

  @Input() totalPageNumber: number;
  @Output() paginationChange = new EventEmitter();

  paginationConf = new PaginationConf();
  pageList = [];
  // totalPageNumber: number;

  perPageOptions = [10, 25, 50, 100];
  selectedPerPageItemNumber: number;

  constructor() { }

  ngOnInit() {
    this.paginationConf.currentPage = 1;
    this.paginationConf.itemsPerPage = 10;
    this.calPageList();
    this.selectedPerPageItemNumber = this.paginationConf.itemsPerPage;
    this.emitChange();
  }


  ngAfterContentChecked() {
    this.calPageList();
  }

  calPageList() {
    // 求 pageList, 显示 5 个页码的标签
    this.pageList = [];
    if (this.totalPageNumber <= 5) {
      for (let i = 1; i <= this.totalPageNumber; i++) { this.pageList.push(i); }
    } else if (this.paginationConf.currentPage <= 3) {
      for (let i = 1; i <= 5; i++) { this.pageList.push(i); }
    } else if ( this.totalPageNumber - this.paginationConf.currentPage <= 2) {
      for (let i = this.totalPageNumber - 4; i <= this.totalPageNumber; i++) { this.pageList.push(i); }
    } else {
      for (let i = this.paginationConf.currentPage - 2; i <= this.paginationConf.currentPage + 2; i++) { this.pageList.push(i); }
    }
  }

  onCurrentPageChange() {
    this.calPageList();
  }

  firstPage() {
    if (this.paginationConf.currentPage !== 1) {
      this.paginationConf.currentPage = 1;
      this.onCurrentPageChange();
      this.emitChange();
    }
  }

  lastPage() {
    if (this.paginationConf.currentPage !== this.totalPageNumber) {
      this.paginationConf.currentPage = this.totalPageNumber;
      this.onCurrentPageChange();
      this.emitChange();
    }
  }

  previousPage() {
    if (this.paginationConf.currentPage > 1) {
      this.paginationConf.currentPage -= 1;
      this.onCurrentPageChange();
      this.emitChange();
    }
  }

  nextPage() {
    if (this.paginationConf.currentPage < this.totalPageNumber) {
      this.paginationConf.currentPage += 1;
      this.onCurrentPageChange();
      this.emitChange();
    }
  }

  goToPage(page: number) {
    this.paginationConf.currentPage = page;
    this.onCurrentPageChange();
    this.emitChange();
  }

  pageNumberInputedChanges(pageNumberInputedStr: string) {
    // alert('pageNumberInputedChanges');
    const pageNumberInputed = +pageNumberInputedStr;
    if (  (pageNumberInputed !== this.paginationConf.currentPage) && (pageNumberInputed >= 1) &&
     (pageNumberInputed <= this.totalPageNumber)  ) {
      this.paginationConf.currentPage = pageNumberInputed;
      this.onCurrentPageChange();
      this.emitChange();
    }
  }

  selectedPerPageItemNumberChanges() {
    this.paginationConf.itemsPerPage = this.selectedPerPageItemNumber;
    this.paginationConf.currentPage = 1;
    // this.onCurrentPageChange();
    this.calPageList();
    this.emitChange();
  }

  emitChange() {
    this.paginationChange.emit(this.paginationConf);
  }
}
