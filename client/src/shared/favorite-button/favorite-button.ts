import { FunctionExpr } from '@angular/compiler';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-favorite-button',
  imports: [],
  templateUrl: './favorite-button.html',
  styleUrl: './favorite-button.css',
})
export class FavoriteButton {
  clickEvent = output<Event>();
  disabled = input<boolean>(true);
  selected = input<boolean>(false);

  onClick(event: Event) {
    this.clickEvent.emit(event);
  }
}
