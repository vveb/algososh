import { ElementStates } from "../types/element-states";
import { ViewItem } from "../types/view.types";
import { reverseStringGenerator } from "./generators";
import { getGeneratorResult, makeTestViewItemString } from "./test-helpers";

jest.mock("nanoid", () => {
  return { nanoid: () => "1234" };
});

describe('correct return of reverseStringGenerator', () => {

  it('should return correct reversed string with even number of characters', () => {
    const str = 'abcd';
    const expected = Array.from('dcba').map(
      (symbol) => makeTestViewItemString(symbol, ElementStates.Modified)
    );
    const generator = reverseStringGenerator(str);
    const actual = getGeneratorResult(generator);
    expect(actual).toMatchObject(expected);
  });

  it('should return correct reversed string with odd number of characters', () => {
    const str = 'abc';
    const expected = Array.from('cba').map(
      (symbol) => makeTestViewItemString(symbol, ElementStates.Modified)
    );
    const generator = reverseStringGenerator(str);
    const actual = getGeneratorResult(generator);
    expect(actual).toMatchObject(expected);
  });

  it('should return correct reversed string with one character', () => {
    const str = 'a';
    const expected = [makeTestViewItemString(str, ElementStates.Modified)];
    const generator = reverseStringGenerator(str);
    const actual = getGeneratorResult(generator);
    expect(actual).toMatchObject(expected);
  });

  it('should return correct result for empty string', () => {
    const str = '';
    const expected: ViewItem<string>[] = [];
    const generator = reverseStringGenerator(str);
    const actual = getGeneratorResult(generator);
    expect(actual).toMatchObject(expected);
  });
});