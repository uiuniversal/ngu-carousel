import {
  AnimationTriggerMetadata,
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

/** Time and timing curve for expansion panel animations. */
export const EXPANSION_PANEL_ANIMATION_TIMING =
  '225ms cubic-bezier(0.4,0.0,0.2,1)';

/** Animations used by the Material expansion panel. */
export const btnAnim: AnimationTriggerMetadata = trigger('btnAnim', [
  state('true', style({ opacity: 1, transform: 'translate3d(0,0,0)' })),
  state(
    'false',
    style({
      opacity: 0,
      transform: `translate3d({{btn}}50px,0,0)`
    }),
    {
      params: { btn: 'left' }
    }
  ),
  transition('* => *', animate('300ms cubic-bezier(.75,-0.48,.26,1.52)'))
]);
