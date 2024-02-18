import renderer from 'react-test-renderer';

import { Button } from './button';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Button rendering', () => {

  it('Button with text rendering successfull', () => {
    const tree = renderer
    .create(<Button text='Some text'/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Button without text rendering successfull', () => {
    const tree = renderer
    .create(<Button />)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Button disabled rendering successfull', () => {
    const tree = renderer
    .create(<Button disabled={true} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Button with loader rendering successfull', () => {
    const tree = renderer
    .create(<Button isLoader={true} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('some', () => {
  it('Button has correct onClick event processing', () => {
    window.alert = jest.fn();
    render(<Button onClick={() => alert('Button has clicked')}/>)
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(window.alert).toHaveBeenCalledWith('Button has clicked');
  });
});
