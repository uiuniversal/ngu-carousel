import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { NguTileComponent } from './ngu-tile.component';

const meta: Meta<NguTileComponent> = {
  title: 'Carousel/NguTile',
  component: NguTileComponent,
  decorators: [
    moduleMetadata({
      imports: [NguTileComponent]
    })
  ]
};

export default meta;
type Story = StoryObj<NguTileComponent>;

export const Primary: Story = {
  render: (args: NguTileComponent) => ({
    props: args
  }),
  args: {}
};
