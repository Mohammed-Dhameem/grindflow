import { trigger, transition, style, animate } from '@angular/animations';

export const fade = trigger('fade', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 }))
    ]),
    transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
    ])
]);
