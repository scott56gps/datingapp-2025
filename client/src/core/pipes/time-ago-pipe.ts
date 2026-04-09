import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    console.log("PIPE: value: " + value)
    console.log("PIPE: now: " + now)
    console.log("PIPE: date: " + date)
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 0) return 'just now';

    const intervals: { label: string; seconds: number }[] = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'just nowww';
  }

}
