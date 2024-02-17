import React, { useCallback, useMemo, useRef, useState } from "react";
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
import { useMounted } from "../../hooks/use-mounted.hook";
import { DELAY_IN_MS } from "../../constants/delays";

export const SortingPage: React.FC = () => {

  const isAlive = useMounted();

  const [view, setView] = useState<ViewItem<number>[]>([]);
  const [sortType, setSortType] = useState<SortingType>(SortingType.Selection);
  const [sortDirection, setSortDirection] = useState<Direction | null>(null)
  const [isAnimating, setIsAnimating] = useState(false);

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
      if (isAlive) {
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
            setSortDirection(null);
          };
        };
      };
    }, DELAY_IN_MS);
  };

  const handleStartSortingAsc = () => {
    sortingGeneratorRef.current = sortingGenerators[sortType](view, Direction.Ascending);
    setSortDirection(Direction.Ascending);
    startSort();
  };

  const handleStartSortingDesc = () => {
    sortingGeneratorRef.current = sortingGenerators[sortType](view, Direction.Descending);
    setSortDirection(Direction.Descending);
    startSort();
  };

  const handleChangeSortingType = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setSortType(value as SortingType);
  };

  const randomArr = useCallback(() => {
    const minLen = 3;
    const maxLen = 17;
    const limit = Math.floor(Math.random()*(maxLen-minLen) + minLen);
    const res = [];
    for (let i=0; i<limit; i++) {
      res.push(Math.floor(Math.random()*100));
    };
    setView(res.map((num) => ({value: num, state: ElementStates.Default, key: nanoid(8)})));
  }, []);

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
            disabled={isAnimating}
          />
          <RadioInput
            label="Пузырёк"
            name="choice"
            value={SortingType.Bubble}
            checked={sortType === SortingType.Bubble}
            onChange={handleChangeSortingType}
            disabled={isAnimating}
          />
        </div>
        <div className={styles.submitButtons}>
          <Button
            text="По возрастанию"
            sorting={Direction.Ascending}
            type="button"
            isLoader={(isAnimating && sortDirection === Direction.Ascending)}
            disabled={isAnimating || isArrayEmpty}
            onClick={handleStartSortingAsc}
          />
          <Button
            text="По убыванию"
            sorting={Direction.Descending}
            type="button"
            isLoader={(isAnimating && sortDirection === Direction.Descending)}
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
