import { Meta, StoryFn } from '@storybook/react';
import { allSizes } from 'app/core/themes/size';
import styled from 'styled-components';
import Button, { allButtonCategories, allButtonVariants, Props } from './index';

const meta = {
  title: 'Components/Buttons/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>;
// eslint-disable-next-line import/export
export default meta;

const Background = styled.div`
  padding: 2em;
  background-color: ${(p) => p.theme.palette.background.canvas};
`;

const Row = styled.div`
  padding: 1em;
  flex-direction: row;
`;

export const Variants: StoryFn<Props> = () => (
  <>
    {allButtonVariants.map((variant) => (
      <Background key={variant}>
        {variant}
        {allButtonCategories.map((category) => (
          <Row key={`${variant}${category}`}>
            {allSizes.map((size) => (
              <Button
                variant={variant}
                category={category}
                size={size}
                key={`${variant}${category}${size}`}
              >
                {`${category}`}
              </Button>
            ))}
          </Row>
        ))}
      </Background>
    ))}
  </>
);
