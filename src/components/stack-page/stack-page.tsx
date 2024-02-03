import React, { ChangeEvent, useMemo, useState } from "react";
import styles from './stack-page.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { ViewItem } from "../../types/view.types";
import { Circle } from "../ui/circle/circle";
import Stack from "../../utils/stack";
import { ElementStates } from "../../types/element-states";
import { nanoid } from "nanoid";

export const StackPage: React.FC = () => {

  const [data, setData] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [view, setView] = useState<ViewItem<string>[]>([]);

  const stack = useMemo(() => new Stack<string>(), []);
  // const stackRef = useRef<IStack<string>>(new Stack<string>());
  const isStackEmpty = useMemo(() => view.length === 0, [view]);

  const handleAddElement = () => {
    if (data) {
      setIsAnimating(true);
      stack.push(data);
      setView((currentView) => [...currentView, {value: data, state: ElementStates.Changing, key: nanoid(8)}]);
      setTimeout(() => {
        setView((currentView) => currentView.map((item) => item.state !== ElementStates.Default ?
          {...item, state: ElementStates.Default} :
          item));
        setData('');
        setIsAnimating(false);
      }, 500);
    };
  };

  const handleDeleteElement = () => {
    if (!isStackEmpty) {
      setIsAnimating(true);
      const last = view.length - 1;
      setView((currentView) => currentView.map((item, index) => index === last ?
        {...item, state: ElementStates.Changing} :
        item));
      setTimeout(() => {
        stack.pop();
        setView((currentView) => currentView.filter((item) => item.state !== ElementStates.Changing));
        setIsAnimating(false);
      }, 500)
    };
  };

  const handleClearStack = () => {
    if (!isStackEmpty) {
      setIsAnimating(true);
      setView((currentView) => currentView.map((item) => ({...item, state: ElementStates.Changing})));
      setTimeout(() => {
        stack.clear();
        setView([]);
        setIsAnimating(false);
      }, 500)
    };
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setData(String(evt.target.value));
  };

  return (
    <SolutionLayout title="Стек">
      <form className={styles.form}>
        <div className={styles.controls}>
          <Input
            extraClass={styles.input}
            placeholder="Введите текст"
            value={data}
            type="text"
            maxLength={4}
            max={4}
            isLimitText={true}
            onChange={handleInputChange}
            disabled={isAnimating}
          />
          <Button
            text="Добавить"
            type="button"
            isLoader={isAnimating}
            disabled={isAnimating || !data}
            onClick={handleAddElement}
          />
          <Button
            text="Удалить"
            type="button"
            isLoader={isAnimating}
            disabled={isAnimating || isStackEmpty}
            onClick={handleDeleteElement}
          />
        </div>
        <Button
            text="Очистить"
            type="button"
            isLoader={isAnimating}
            disabled={isAnimating || isStackEmpty}
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
