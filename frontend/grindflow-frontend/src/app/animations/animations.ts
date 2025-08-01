import { trigger, transition, style, animate, query, sequence} from '@angular/animations';

export const fade = trigger('fade', [
  transition('* <=> *', [
    // Optional: Animate leaving element first
    query(':leave', [
      style({ opacity: 1 }),
      animate('300ms ease-out', style({ opacity: 0 }))
    ], { optional: true }),

    // Then animate entering element
    query(':enter', [
      style({ opacity: 0 }),
      animate('400ms ease-in', style({ opacity: 1 }))
    ], { optional: true })
  ])
]);

export const fadeSwitch = trigger('fadeSwitch', [
  transition(':enter', []), // required for structural animation support
  transition('* <=> *', [
    sequence([
      query(':leave', [
        style({ opacity: 1 }),
        animate('300ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),

      query(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);
