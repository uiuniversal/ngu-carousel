import { Meta } from '@storybook/angular';
import { NguTileComponent } from './ngu-tile.component';

export default {
  title: 'NguTileComponent',
  component: NguTileComponent
} as Meta<NguTileComponent>;

export const Primary = {
  render: (args: NguTileComponent) => ({
    props: args
  }),
  args: {}
};
