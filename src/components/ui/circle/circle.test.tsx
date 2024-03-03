import renderer from 'react-test-renderer';
import { Circle } from "./circle";
import { ElementStates } from '../../../types/element-states';

describe('Circle rendering', () => {
  it('should render Circle component without letter', () => {
    const tree = renderer
    .create(<Circle />)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Circle component with letter', () => {
    const tree = renderer
    .create(<Circle letter='A'/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Circle component with head-string', () => {
    const tree = renderer
    .create(<Circle head='head'/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Circle component with head-reactElement', () => {
    const tree = renderer
    .create(<Circle head={<Circle />}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Circle component with tail-string', () => {
    const tree = renderer
    .create(<Circle tail='head'/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Circle component with tail-reactElement', () => {
    const tree = renderer
    .create(<Circle tail={<Circle />}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Circle component with index', () => {
    const tree = renderer
    .create(<Circle index={0}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Circle component with isSmall prop === true', () => {
    const tree = renderer
    .create(<Circle isSmall={true}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Circle component with default state', () => {
    const tree = renderer
    .create(<Circle state={ElementStates.Default}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Circle component with changing state', () => {
    const tree = renderer
    .create(<Circle state={ElementStates.Changing}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Circle component with modified state', () => {
    const tree = renderer
    .create(<Circle state={ElementStates.Modified}/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });
});