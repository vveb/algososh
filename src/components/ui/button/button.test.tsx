import renderer from 'react-test-renderer';

import { Button } from './button';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Button rendering', () => {

  it('should render Button component with text', () => {
    const tree = renderer
    .create(<Button text='Some text'/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Button component without text', () => {
    const tree = renderer
    .create(<Button />)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Button component disabled', () => {
    const tree = renderer
    .create(<Button disabled={true} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Button component with loader', () => {
    const tree = renderer
    .create(<Button isLoader={true} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('some', () => {
  it('should Button component have the correct handling of the callback for the onClick event', () => {
    window.alert = jest.fn();
    render(<Button onClick={() => alert('Button has clicked')}/>)
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(window.alert).toHaveBeenCalledWith('Button has clicked');
  });
});
