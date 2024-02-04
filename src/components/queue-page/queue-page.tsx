import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import styles from './queue-page.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { ViewItem } from "../../types/view.types";
import { Circle } from "../ui/circle/circle";
import Queue from "../../utils/queue";
import { ElementStates } from "../../types/element-states";
import { makeInitialView } from "../../utils/helpers";

export const QueuePage: React.FC = () => {
  
  
  
  //TODO: для связного списка
  //[...before, {}, ...after]

  const [data, setData] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [view, setView] = useState<ViewItem<string>[]>(makeInitialView(7));
  const [head, setHead] = useState<number | null>(null);
  const [tail, setTail] = useState<number | null>(null);

  const queue = useMemo(() => new Queue<string>(), []);
  const isQueueFull = useMemo(() => queue.size >= 7, [queue.size]);

  const handleEnqueueElement = () => {
    queue.enqueue(data);
    setIsAnimating(true);
    if (head === null && tail === null) {
      setView((currentView) => currentView.map((item, index) => index === 0 ?
        {...item, value: data, state: ElementStates.Changing} :
        item)
      );
      setHead(0);
      setTail(0);
      setTimeout(() => {
        setView((currentView) => currentView.map((item) => ({...item, state: ElementStates.Default})));
        setIsAnimating(false);
        setData('');
      }, 500);
    } else {
      setTail((currentTail) => currentTail !== null ? (currentTail + 1) % 7 : null);
      const newTail = tail !== null ? (tail + 1) % 7 : null;
      setView((currentView) => currentView.map((item, index) => index === newTail ?
          {...item, value: data, state: ElementStates.Changing} :
          item)
      );
      setTimeout(() => {
        setView((currentView) => currentView.map((item) => ({...item, state: ElementStates.Default})));
        setIsAnimating(false);
        setData('');
      }, 500);
    };
  };

  const handleDequeueElement = () => {
    setIsAnimating(true);
    queue.dequeue();
    if (head === tail) {
      handleClearQueue();
    } else {
      const oldHead = head;
      setView((currentView) => currentView.map((item, index) => index === oldHead ?
          {...item, state: ElementStates.Changing} :
          item)
      );
      setTimeout(() => {
        setHead((currentHead) => currentHead !== null ? (currentHead + 1) % 7 : null);
        setView((currentView) => currentView.map(
          (item, index) => ({
            ...item,
            state: ElementStates.Default,
            value: index === oldHead ? '' : item.value
          })
        ));
        setIsAnimating(false);
      }, 500);
    };
  };

  const handleClearQueue = () => {
    setIsAnimating(true);
    setView((currentView) => currentView.map((item) => ({...item, state: ElementStates.Changing})));
    queue.clear();
    setTimeout(() => {
      setView(makeInitialView(7));
      setTail(null);
      setHead(null);
      setIsAnimating(false);
    }, 500);
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setData(String(evt.target.value));
  };

  return (
    <SolutionLayout title="Очередь">
      <form className={styles.form}>
        <div className={styles.controls}>
          <Input
            extraClass={styles.input}
            placeholder="Введите значение"
            value={data}
            type="text"
            maxLength={4}
            max={4}
            isLimitText={true}
            onChange={handleInputChange}
            disabled={isAnimating || isQueueFull}
          />
          <Button
            text="Добавить"
            type="button"
            isLoader={isAnimating}
            disabled={isAnimating || !data || isQueueFull}
            onClick={handleEnqueueElement}
          />
          <Button
            text="Удалить"
            type="button"
            isLoader={isAnimating}
            disabled={isAnimating || queue.isEmpty}
            onClick={handleDequeueElement}
          />
        </div>
        <Button
            text="Очистить"
            type="button"
            isLoader={isAnimating}
            disabled={isAnimating || queue.isEmpty}
            onClick={handleClearQueue}
          />
      </form>
      <div className={styles.visualization}>
        {!!view && view.map((item, index) => (
          <Circle
            letter={String(item.value)}
            state={item.state}
            key={item.key}
            head={index === head ? "head" : ""}
            tail={index === tail ? "tail" : ""}
          />
        ))}
      </div>
    </SolutionLayout>
  );
};
