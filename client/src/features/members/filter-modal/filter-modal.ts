import { Component, ElementRef, model, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberParams } from '../../../types/member';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css',
})
export class FilterModal {
  @ViewChild('filterModal') modalRef!: ElementRef<HTMLDialogElement>;

  closeModal = output();
  submitData = output<MemberParams>();
  // We are stating that memberFilter must be injected into this type
  memberFilter = model(new MemberParams()); // 'model' can act as an input or writable-input

  open(filters: MemberParams) {
    if (filters) {
      this.memberFilter.set(filters)
    }
    this.modalRef.nativeElement.showModal();
  }

  close() {
    this.modalRef.nativeElement.close();
    this.closeModal.emit();  // Notify the parent that the modal has been closed
  }

  submit() {
    this.submitData.emit(this.memberFilter());
    this.close();
  }

  onMinAgeChange() {
    if (this.memberFilter().minAge < 18) {
      this.memberFilter().minAge = 18
    }
  }

  onMaxAgeChange() {
    if (this.memberFilter().maxAge < this.memberFilter().minAge) {
      this.memberFilter().maxAge = this.memberFilter().minAge
    }
  }
}
