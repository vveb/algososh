import React, { useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";
import styles from './sorting-page.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Direction } from "../../types/direction";
import { ViewItem } from "../../types/view.types";
import { SortingType } from "../../types/sorting.types";
import { ElementStates } from "../../types/element-states";
import { Column } from "../ui/column/column";
import { IterableViewWithNumbers } from "../../types/generator.types";
import { bubbleSortGenerator, selectionSortGenerator } from "../../utils/generators";

export const SortingPage: React.FC = () => {

  const [view, setView] = useState<ViewItem<number>[]>([]);
  const [sortType, setSortType] = useState<SortingType>(SortingType.Selection);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const sortingGeneratorRef = useRef<IterableViewWithNumbers | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const sortingGenerators = useMemo(() => ({
    [SortingType.Selection]: selectionSortGenerator,
    [SortingType.Bubble]: bubbleSortGenerator,
  }), []);

  const isArrayEmpty = useMemo(() => view.length === 0, [view]);

  const startSort = () => {
    setIsAnimating(true);
    animationRef.current = window.setInterval(() => {
      if (sortingGeneratorRef.current) {
        const { value: view, done } = sortingGeneratorRef.current.next();
        if (view) {
          setView(view);
        };
        if (done) {
          window.clearInterval(animationRef.current);
          animationRef.current = 0;
          sortingGeneratorRef.current = null;
          setIsAnimating(false);
        };
      }
    }, 1000)
  }

  const handleStartSortingAsc = () => {
    sortingGeneratorRef.current = sortingGenerators[sortType](view, Direction.Ascending)
    startSort();
  }

  const handleStartSortingDesc = () => {
    sortingGeneratorRef.current = sortingGenerators[sortType](view, Direction.Descending)
    startSort();
  }

  const handleChangeSortingType = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setSortType(value as SortingType);
  }

  const randomArr = () => {
    const minLen = 3;
    const maxLen = 17;
    const limit = Math.floor(Math.random()*(maxLen-minLen) + minLen);
    const res = [];
    for (let i=0; i<limit; i++) {
      res.push(Math.floor(Math.random()*100));
    };
    setView(res.map((num) => ({value: num, state: ElementStates.Default, key: nanoid(8)})));
  }

  return (
    <SolutionLayout title="Сортировка массива">
      <form className={styles.form}>
        <div className={styles.radioButtons}>
          <RadioInput
            label="Выбор"
            name="choice"
            value={SortingType.Selection}
            checked={sortType === SortingType.Selection}
            onChange={handleChangeSortingType}
          />
          <RadioInput
            label="Пузырёк"
            name="choice"
            value={SortingType.Bubble}
            checked={sortType === SortingType.Bubble}
            onChange={handleChangeSortingType}
          />
        </div>
        <div className={styles.submitButtons}>
          <Button
            text="По возрастанию"
            sorting={Direction.Ascending}
            type="button"
            isLoader={isAnimating}
            disabled={isAnimating || isArrayEmpty}
            onClick={handleStartSortingAsc}
          />
          <Button
            text="По убыванию"
            sorting={Direction.Descending}
            type="button"
            isLoader={isAnimating}
            disabled={isAnimating || isArrayEmpty}
            onClick={handleStartSortingDesc}
          />
        </div>
        <Button
          extraClass={styles.newArrButton}
          text="Новый массив" type="button"
          onClick={randomArr}
          disabled={isAnimating}
        />
      </form>
      <div className={styles.visualization}>
        {view.map((item) => <Column index={item.value} state={item.state} key={item.key}/>)}
      </div>
    </SolutionLayout>
  );
};
