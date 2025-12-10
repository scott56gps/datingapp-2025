import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUpload {
  protected imageSrc = signal<string | ArrayBuffer | undefined | null>(null);
  protected isDragging = false;
  private fileToUpload: File | null = null;
  uploadFile = output<File>(); // This is a pointer to a piece of data that this component is supposed to *eventually* provide
  loading = input<boolean>(false); // This is a pointer to an external piece of data being provided to this component

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      // Get one file at a time
      const file = event.dataTransfer.files[0];
      this.previewImage(file); // SETS this.imageSrc property
      this.fileToUpload = file;
    }
  }

  onCancel() {
    this.fileToUpload = null;
    this.imageSrc.set(null);
  }

  onUploadFile() {
    if (this.fileToUpload) {
      this.uploadFile.emit(this.fileToUpload); // Send it to whoever wants it!
    }
  }

  // SIDE-EFFECT: Sets the imageSrc property with a provided file
  private previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => this.imageSrc.set(event.target?.result);
    reader.readAsDataURL(file);
  }
}
