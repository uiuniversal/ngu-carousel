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
export const slider: AnimationTriggerMetadata = trigger('slider', [
  state('true, false', style({ transform: 'none' })),
  state('true', style({ transform: '{{distance}}' }), {
    params: { distance: '0' }
  }),
  state('false', style({ transform: '{{distance}}' }), {
    params: { distance: '0' }
  }),
  transition('* => *', animate('{{timing}}'), {
    params: { timing: '500ms cubic-bezier(0.35, 0, 0.25, 1)' }
  })
]);
