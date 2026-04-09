import { inject, Component, signal, OnInit, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Member, MemberParams } from '../../../types/member';
import { MemberCard } from '../member-card/member-card';
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from '../../../shared/paginator/paginator';
import { Observable } from 'rxjs';
import { FilterModal } from '../filter-modal/filter-modal';
import { LOCAL_STORAGE_FILTERS_KEY } from '../../../constants';
import { shallowEqual } from '../../../utils';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  private memberService = inject(MemberService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  private updatedParams = new MemberParams(); // Used after we submit to the backend

  constructor() {
    // If filters are present, assign them to the memberParams
    const filters = localStorage.getItem(LOCAL_STORAGE_FILTERS_KEY);
    if (filters) {
      const parsedFilters = JSON.parse(filters);
      this.memberParams = parsedFilters;
      this.updatedParams = parsedFilters;
    }
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: (result) => {
        this.paginatedMembers.set(result);
      },
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;
    this.loadMembers();
  }

  openModal() {
    // By passing using the spread operator, we break the reference back to the original object.
    // Modal has its own copy to play with
    this.modal.open({ ...this.memberParams });
  }

  onClose() {
    console.log('Modal was closed');
  }

  onFilterChange(data: MemberParams) {
    this.memberParams = { ...data }; // We make a shallow copy here.  These 2 are now separated in memory.
    this.updatedParams = { ...data };
    this.loadMembers();
  }

  resetFilters() {
    this.memberParams = new MemberParams();
    this.updatedParams = new MemberParams();
    this.loadMembers();
  }

  // Computed property
  get displayMessage(): string {
    const defaultParams = new MemberParams();
    const filters: string[] = [];

    if (this.updatedParams.gender) {
      filters.push(this.memberParams.gender + 's')
    }

    if (this.updatedParams.minAge !== defaultParams.minAge ||
      this.updatedParams.maxAge !== defaultParams.maxAge) {
      filters.push(` ages ${this.memberParams.minAge}-${this.memberParams.maxAge}`);
    }

    filters.push(this.updatedParams.orderBy === 'lastActive'
      ? 'Recently Active' : 'Newest Members');

    return filters.length > 0 ? `Selected: ${filters.join(' | ')}` : 'All Members';
  }
}
