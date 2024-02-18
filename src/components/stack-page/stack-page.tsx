import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import styles from './stack-page.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { ViewItem } from "../../types/view.types";
import { Circle } from "../ui/circle/circle";
import Stack from "../../utils/stack";
import { ElementStates } from "../../types/element-states";
import { nanoid } from "nanoid";
import { StackIsAnimated } from "../../types/stack.types";
import { useMounted } from "../../hooks/use-mounted.hook";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

export const StackPage: React.FC = () => {

  const isAlive = useMounted();

  const [inputData, setInputData] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<StackIsAnimated>({
    isPushAnimating: false,
    isPopAnimating: false,
    isClearAnimating: false,
  });
  const isAnyAnimating = useCallback(() => 
    isAnimating.isPushAnimating ||
    isAnimating.isPopAnimating ||
    isAnimating.isClearAnimating,
    [
      isAnimating.isPushAnimating,
      isAnimating.isPopAnimating,
      isAnimating.isClearAnimating
    ]
  );
  const [view, setView] = useState<ViewItem<string>[]>([]);

  const stack = useMemo(() => new Stack<string>(), []);
  const isStackEmpty = useMemo(() => view.length === 0, [view]);

  const handleAddElement = () => {
    if (inputData) {
      setIsAnimating({...isAnimating, isPushAnimating: true});
      stack.push(inputData);
      setView((currentView) => [...currentView, {value: inputData, state: ElementStates.Changing, key: nanoid(8)}]);
      setTimeout(() => {
        if (isAlive) {
          setView((currentView) => currentView.map((item) => item.state !== ElementStates.Default ?
            {...item, state: ElementStates.Default} :
            item
          ));
          setInputData('');
          setIsAnimating({...isAnimating, isPushAnimating: false});
        };
      }, SHORT_DELAY_IN_MS);
    };
  };

  const handleDeleteElement = () => {
    if (!isStackEmpty) {
      setIsAnimating({...isAnimating, isPopAnimating: true});
      const last = view.length - 1;
      setView((currentView) => currentView.map((item, index) => index === last ?
        {...item, state: ElementStates.Changing} :
        item));
      setTimeout(() => {
        stack.pop();
        setView((currentView) => currentView.filter((item) => item.state !== ElementStates.Changing));
        setIsAnimating({...isAnimating, isPopAnimating: false});
      }, SHORT_DELAY_IN_MS);
    };
  };

  const handleClearStack = () => {
    if (!isStackEmpty) {
      setIsAnimating({...isAnimating, isClearAnimating: true});
      setView((currentView) => currentView.map((item) => ({...item, state: ElementStates.Changing})));
      setTimeout(() => {
        if (isAlive) {
          stack.clear();
          setView([]);
          setIsAnimating({...isAnimating, isClearAnimating: false});
        };
      }, SHORT_DELAY_IN_MS);
    };
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputData(String(evt.target.value));
  };

  return (
    <SolutionLayout title="Стек">
      <form className={styles.form}>
        <div className={styles.controls}>
          <Input
            extraClass={styles.input}
            placeholder="Введите текст"
            value={inputData}
            type="text"
            maxLength={4}
            max={4}
            isLimitText={true}
            onChange={handleInputChange}
            disabled={isAnyAnimating()}
          />
          <Button
            text="Добавить"
            type="button"
            isLoader={isAnimating.isPushAnimating}
            disabled={isAnyAnimating() || !inputData}
            onClick={handleAddElement}
          />
          <Button
            text="Удалить"
            type="button"
            isLoader={isAnimating.isPopAnimating}
            disabled={isAnyAnimating() || isStackEmpty}
            onClick={handleDeleteElement}
          />
        </div>
        <Button
            text="Очистить"
            type="button"
            isLoader={isAnimating.isClearAnimating}
            disabled={isAnyAnimating() || isStackEmpty}
            onClick={handleClearStack}
          />
      </form>
      <div className={styles.visualization}>
        {!!view && view.map((item, index) => (
          <Circle letter={String(item.value)} index={index} state={item.state} key={item.key} head={index === view.length-1 ? "top" : ""} />
        ))}
      </div>
    </SolutionLayout>
  );
};
