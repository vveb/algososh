import React, { ChangeEvent, ReactNode, useState } from "react";
import styles from './list-page.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { ViewItem } from "../../types/view.types";
import { makeInitialView } from "../../utils/helpers";
import { Circle } from "../ui/circle/circle";

export const ListPage: React.FC = () => {

  const [elementData, setElementData] = useState<string>('');
  const [indexData, setIndexData] = useState<number | null>(null);
  const [view, setView] = useState<ViewItem<string>[]>(makeInitialView(4, '', true));
  const [head, setHead] = useState<number | null>(0);
  const [tail, setTail] = useState<number | null>(3);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleAddElement = () => {

  }

  const handleDeleteElement = () => {

  }

  const handleDataChange = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.target.name === 'element' ? setElementData(evt.target.value) : setIndexData(Number(evt.target.value))
  }

  return (
    <SolutionLayout title="Связный список">
      <form className={styles.form}>
        <div className={styles.controls_top}>
          <Input
            extraClass={styles.input}
            placeholder="Введите значение"
            type="text"
            maxLength={4}
            max={4}
            isLimitText={true}
            name="element"
            onChange={handleDataChange}
          />
          <Button
            extraClass={styles.smallButton}
            text="Добавить в head"
            type="button"
            isLoader={isAnimating}
            linkedList="small"
            disabled={!elementData || isAnimating}
            onClick={handleAddElement}
          />
          <Button
            extraClass={styles.smallButton}
            text="Добавить в tail"
            type="button"
            isLoader={isAnimating}
            linkedList="small"
            disabled={!elementData || isAnimating}
            onClick={handleAddElement}
          />
          <Button
            extraClass={styles.smallButton}
            text="Удалить из head"
            type="button"
            isLoader={isAnimating}
            linkedList="small"
            disabled={!elementData || isAnimating}
            onClick={handleDeleteElement}
          />
          <Button
            extraClass={styles.smallButton}
            text="Удалить из tail"
            type="button"
            isLoader={isAnimating}
            linkedList="small"
            disabled={!elementData || isAnimating}
            onClick={handleDeleteElement}
          />
        </div>
        <div className={styles.controls_bottom}>
        <Input
            extraClass={styles.input}
            placeholder="Введите значение"
            type="number"
            maxLength={2}
            max={4}
            isLimitText={true}
            name="index"
            onChange={handleDataChange}
          />
          <Button
            text="Добавить по индексу"
            type="button"
            isLoader={isAnimating}
            linkedList="big"
            disabled={!indexData || isAnimating}
            onClick={handleAddElement}
          />
          <Button
            text="Удалить по индексу"
            type="button"
            isLoader={isAnimating}
            linkedList="big"
            disabled={!indexData || isAnimating}
            onClick={handleDeleteElement}
          />
        </div>
      </form>
      <div className={styles.visualization}>
        <div className={styles.box}>
        {!!view && view.map((item, index): ReactNode => {
          if (index !== tail) {
            return(
              <>
              <Circle
              letter={String(item.value)}
              state={item.state}
              key={item.key}
              head={index === head ? "head" : ""}
              />
              <ArrowIcon />
              </>
            )
          }
          return(
            <Circle
              letter={String(item.value)}
              state={item.state}
              key={item.key}
              tail={index === tail ? "tail" : ""}
            />
          )
        })}
        </div>
      </div>
    </SolutionLayout>
  );
};
