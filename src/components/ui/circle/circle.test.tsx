import renderer from 'react-test-renderer';
import { Circle } from "./circle";
import { ElementStates } from '../../../types/element-states';

describe('Circle rendering', () => {
  it('Circle without letter rendering successfull', () => {
    const tree = renderer
    .create(<Circle />)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Circle with letter rendering successfull', () => {
    const tree = renderer
    .create(<Circle letter='A'/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Circle with head-string rendering successfull', () => {
    const tree = renderer
    .create(<Circle head='head'/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Circle with head-reactElement rendering successfull', () => {
    const tree = renderer
    .create(<Circle head={<Circle />}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Circle with tail-string rendering successfull', () => {
    const tree = renderer
    .create(<Circle tail='head'/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Circle with tail-reactElement rendering successfull', () => {
    const tree = renderer
    .create(<Circle tail={<Circle />}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Circle with index rendering successfull', () => {
    const tree = renderer
    .create(<Circle index={0}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Circle with isSmall prop === true rendering successfull', () => {
    const tree = renderer
    .create(<Circle isSmall={true}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Circle with default state rendering successfull', () => {
    const tree = renderer
    .create(<Circle state={ElementStates.Default}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Circle with changing state rendering successfull', () => {
    const tree = renderer
    .create(<Circle state={ElementStates.Changing}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Circle with modified state rendering successfull', () => {
    const tree = renderer
    .create(<Circle state={ElementStates.Modified}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });
});