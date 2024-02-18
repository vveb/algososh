import { Direction } from "../types/direction";
import { ElementStates } from "../types/element-states";
import { ViewItem } from "../types/view.types";
import { bubbleSortGenerator, selectionSortGenerator } from "./generators";
import { getGeneratorResult, makeTestViewItemNumber } from "./test-helpers";

jest.mock("nanoid", () => {
  return { nanoid: () => "1234" };
});

describe('correct return of sorting algorithms', () => {
  const emptyArray: ViewItem<number>[] = [];
  const oneElementArray = [makeTestViewItemNumber(5, ElementStates.Default)];
  const severalElementsArray = [5, 20, 8, 33, 25].map((item) => makeTestViewItemNumber(item, ElementStates.Default));

  const expectedEmptyArray: ViewItem<number>[] = [];
  const expectedOneElementArray = [makeTestViewItemNumber(5, ElementStates.Modified)];
  const expectedSeveralElementsArrayAscending = [5, 8, 20, 25, 33].map(
    (item) => makeTestViewItemNumber(item, ElementStates.Modified)
  );
  const expectedSeveralElementsArrayDescending = [33, 25, 20, 8, 5].map(
    (item) => makeTestViewItemNumber(item, ElementStates.Modified)
  );

  describe('correct return of selectionSortGenerator', () => {
    it('should return correct result for empty array & ascending direction', () => {
      const generator = selectionSortGenerator(emptyArray, Direction.Ascending);
      const actual = getGeneratorResult(generator);
      expect(actual).toMatchObject(expectedEmptyArray);
    });

    it('should return correct result for empty array & descending direction', () => {
      const generator = selectionSortGenerator(emptyArray, Direction.Descending);
      const actual = getGeneratorResult(generator);
      expect(actual).toMatchObject(expectedEmptyArray);
    });

    it('should return correct result for one element array & ascending direction', () => {
      const generator = selectionSortGenerator(oneElementArray, Direction.Ascending);
      const actual = getGeneratorResult(generator);
      expect(actual).toMatchObject(expectedOneElementArray);
    });

    it('should return correct result for one element array & descending direction', () => {
      const generator = selectionSortGenerator(oneElementArray, Direction.Descending);
      const actual = getGeneratorResult(generator);
      expect(actual).toMatchObject(expectedOneElementArray);
    });

    it('should return correct result for several elements array & ascending direction', () => {
      const generator = selectionSortGenerator(severalElementsArray, Direction.Ascending);
      const actual = getGeneratorResult(generator);
      expect(actual).toMatchObject(expectedSeveralElementsArrayAscending);
    });

    it('should return correct result for several elements array & descending direction', () => {
      const generator = selectionSortGenerator(severalElementsArray, Direction.Descending);
      const actual = getGeneratorResult(generator);
      expect(actual).toMatchObject(expectedSeveralElementsArrayDescending);
    });
  });

  describe('correct return of bubbleSortGenerator', () => {
    it('should return correct result for empty array & ascending direction', () => {
      const generator = bubbleSortGenerator(emptyArray, Direction.Ascending);
      const actual = getGeneratorResult(generator);
      expect(actual).toMatchObject(expectedEmptyArray);
    });

    it('should return correct result for empty array & descending direction', () => {
      const generator = bubbleSortGenerator(emptyArray, Direction.Descending);
      const actual = getGeneratorResult(generator);
      expect(actual).toMatchObject(expectedEmptyArray);
    });

    it('should return correct result for one element array & ascending direction', () => {
      const generator = bubbleSortGenerator(oneElementArray, Direction.Ascending);
      const actual = getGeneratorResult(generator);
      expect(actual).toMatchObject(expectedOneElementArray);
    });

    it('should return correct result for one element array & descending direction', () => {
      const generator = bubbleSortGenerator(oneElementArray, Direction.Descending);
      const actual = getGeneratorResult(generator);
      expect(actual).toMatchObject(expectedOneElementArray);
    });

    it('should return correct result for several elements array & ascending direction', () => {
      const generator = bubbleSortGenerator(severalElementsArray, Direction.Ascending);
      const actual = getGeneratorResult(generator);
      expect(actual).toMatchObject(expectedSeveralElementsArrayAscending);
    });

    it('should return correct result for several elements array & descending direction', () => {
      const generator = bubbleSortGenerator(severalElementsArray, Direction.Descending);
      const actual = getGeneratorResult(generator);
      expect(actual).toMatchObject(expectedSeveralElementsArrayDescending);
    });
  });
});