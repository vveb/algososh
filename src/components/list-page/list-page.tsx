import React, { ChangeEvent, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from './list-page.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { ViewItem } from "../../types/view.types";
import { makeInitialView } from "../../utils/helpers";
import { Circle } from "../ui/circle/circle";
import LinkedList from "../../utils/linked-list";
import { LinkedListActions, LinkedListIsAnimated } from "../../types/linked-list.types";
import { addElementAtIndexGenerator, addElementToHeadGenerator, addElementToTailGenerator, deleteElementFromHeadGenerator, deleteElementFromIndexGenerator, deleteElementFromTailGenerator } from "../../utils/generators";
import { IterableViewWithStrings } from "../../types/generator.types";
import { useMounted } from "../../hooks/use-mounted.hook";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

export const ListPage: React.FC = () => {

  const isAlive = useMounted();

  const linkedList = useMemo(() => new LinkedList<string>(), []);
  const isLinkedListEmpty = useMemo(() => linkedList.isEmpty, [linkedList.isEmpty]);
  const isLinkedListFull = useMemo(() => linkedList.size >= 6, [linkedList.size]);
 
  const [view, setView] = useState<ViewItem<string>[]>([]);

  useEffect(() => {
    const arr = makeInitialView(Math.floor(Math.random()*6+1)).map((item) => ({
      ...item,
      value: String(Math.floor(Math.random()*100)),
    }))
    arr.forEach((item) => {
      linkedList.append(item.value);
    });
    setView(arr);
  }, [linkedList]);

  const [elementData, setElementData] = useState('');
  const [indexData, setIndexData] = useState(0);
  const isIndexDataValid = useMemo(() => indexData >= 0 && indexData < view.length, [indexData, view.length]);

  const [isAnimating, setIsAnimating] = useState<LinkedListIsAnimated>({
    isAddToHeadAnimating: false,
    isAddToTailAnimating: false,
    isDeleteFromHeadAnimating: false,
    isDeleteFromTailAnimating: false,
    isAddAtIndexAnimating: false,
    isDeleteFromIndexAnimating: false,
  });
  const isAnyButtonAnimating = useCallback(() => 
    isAnimating.isAddAtIndexAnimating ||
    isAnimating.isAddToHeadAnimating ||
    isAnimating.isAddToTailAnimating ||
    isAnimating.isDeleteFromHeadAnimating ||
    isAnimating.isDeleteFromIndexAnimating ||
    isAnimating.isDeleteFromTailAnimating,
  [
    isAnimating.isAddAtIndexAnimating,
    isAnimating.isAddToHeadAnimating,
    isAnimating.isAddToTailAnimating,
    isAnimating.isDeleteFromHeadAnimating,
    isAnimating.isDeleteFromIndexAnimating,
    isAnimating.isDeleteFromTailAnimating,
  ]);

  const stopAllAnimating = useCallback(() => {
    Object.keys(isAnimating).forEach((key) => {
      setIsAnimating((current) => ({...current, [key]: false}));
    });
  }, [isAnimating]);

  const runAnimation = useCallback(() => {
    animationRef.current = window.setInterval(() => {
      if (isAlive) {
        if (linkedListGeneratorRef.current) {
          const { value: view, done } = linkedListGeneratorRef.current.next();
          if (view) {
            setView(view);
          };
          if (done) {
            window.clearInterval(animationRef.current);
            animationRef.current = 0;
            linkedListGeneratorRef.current = null;
            stopAllAnimating();
          };
        };
      };
    }, SHORT_DELAY_IN_MS);
  }, [stopAllAnimating, isAlive]);

  const linkedListGenerators = useMemo(() => ({
    [LinkedListActions.AddToHead]: addElementToHeadGenerator,
    [LinkedListActions.AddToTail]: addElementToTailGenerator,
    [LinkedListActions.DeleteFromHead]: deleteElementFromHeadGenerator,
    [LinkedListActions.DeleteFromTail]: deleteElementFromTailGenerator,
    [LinkedListActions.AddAtIndex]: addElementAtIndexGenerator,
    [LinkedListActions.DeleteFromIndex]: deleteElementFromIndexGenerator,
  }), []);
  const linkedListGeneratorRef = useRef<IterableViewWithStrings | null>(null);

  const animationRef = useRef<number | undefined>(undefined);

  const handleAddElement = (evt: React.MouseEvent<HTMLButtonElement>) => {
    if (evt.currentTarget.name === LinkedListActions.AddToHead) {
      setIsAnimating({...isAnimating, isAddToHeadAnimating: true});
      linkedListGeneratorRef.current = linkedListGenerators[LinkedListActions.AddToHead](view, elementData);
      linkedList.prepend(elementData);
    } else {
      setIsAnimating({...isAnimating, isAddToTailAnimating: true});
      linkedListGeneratorRef.current = linkedListGenerators[LinkedListActions.AddToTail](view, elementData);
      linkedList.append(elementData);
    }
    runAnimation();
    setElementData('');
  };

  const handleDeleteElement = (evt: React.MouseEvent<HTMLButtonElement>) => {
    if (evt.currentTarget.name === LinkedListActions.DeleteFromHead) {
      setIsAnimating({...isAnimating, isDeleteFromHeadAnimating: true});
      linkedListGeneratorRef.current = linkedListGenerators[LinkedListActions.DeleteFromHead](view);
      linkedList.deleteHead();
    } else {
      setIsAnimating({...isAnimating, isDeleteFromTailAnimating: true});
      linkedListGeneratorRef.current = linkedListGenerators[LinkedListActions.DeleteFromTail](view);
      linkedList.deleteTail();
    };
    runAnimation();
    setElementData('');
    setIndexData(0);
  };

  const handleAddElementAtIndex = () => {
    const index = Number(indexData);
    linkedListGeneratorRef.current = linkedListGenerators[LinkedListActions.AddAtIndex](view, index, elementData);
    setIsAnimating({...isAnimating, isAddAtIndexAnimating: true});
    linkedList.addByIndex(elementData, index);
    runAnimation();
    setElementData('');
    setIndexData(0);
  };

  const handleDeleteElementAtIndex = () => {
    const index = Number(indexData);
    linkedListGeneratorRef.current = linkedListGenerators[LinkedListActions.DeleteFromIndex](view, index);
    setIsAnimating({...isAnimating, isDeleteFromIndexAnimating: true});
    linkedList.deleteByIndex(index);
    runAnimation();
    setElementData('');
    setIndexData(0);
  };

  const handleDataChange = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.target.name === 'element' ? setElementData(evt.target.value) : setIndexData(Number(evt.target.value));
  };

  const makeSmallCircle = (item: ViewItem<string> | string): ReactElement | string | null => {
    if (typeof item === 'string') {
      return item;
    };
    return(
      <Circle
        letter={item.value}
        state={item.state}
        key={item.key}
        isSmall
        head={null}
        tail={null}
      />
    );
  };

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
            value={elementData}
            disabled={isLinkedListFull || isAnyButtonAnimating()}
          />
          <Button
            extraClass={styles.smallButton}
            text="Добавить в head"
            type="button"
            isLoader={isAnimating.isAddToHeadAnimating}
            linkedList="small"
            disabled={!elementData || isAnyButtonAnimating() || isLinkedListFull}
            name={LinkedListActions.AddToHead}
            onClick={handleAddElement}
          />
          <Button
            extraClass={styles.smallButton}
            text="Добавить в tail"
            type="button"
            isLoader={isAnimating.isAddToTailAnimating}
            linkedList="small"
            disabled={!elementData || isAnyButtonAnimating() || isLinkedListFull}
            name={LinkedListActions.AddToTail}
            onClick={handleAddElement}
          />
          <Button
            extraClass={styles.smallButton}
            text="Удалить из head"
            type="button"
            isLoader={isAnimating.isDeleteFromHeadAnimating}
            linkedList="small"
            disabled={isAnyButtonAnimating() || isLinkedListEmpty}
            name={LinkedListActions.DeleteFromHead}
            onClick={handleDeleteElement}
          />
          <Button
            extraClass={styles.smallButton}
            text="Удалить из tail"
            type="button"
            isLoader={isAnimating.isDeleteFromTailAnimating}
            linkedList="small"
            disabled={isAnyButtonAnimating() || isLinkedListEmpty}
            name={LinkedListActions.DeleteFromTail}
            onClick={handleDeleteElement}
          />
        </div>
        <div className={styles.controls_bottom}>
        <Input
            extraClass={styles.input}
            placeholder="Введите значение"
            type="number"
            maxLength={1}
            max={view.length === 0 ? 0 : view.length-1}
            min={0}
            isLimitText={true}
            name="index"
            onChange={handleDataChange}
            value={indexData}
            disabled={isAnyButtonAnimating() || isLinkedListEmpty}
          />
          <Button
            extraClass={styles.bigButton}
            text="Добавить по индексу"
            type="button"
            isLoader={isAnimating.isAddAtIndexAnimating}
            linkedList="big"
            disabled={indexData === undefined ||
              isAnyButtonAnimating() ||
              isLinkedListFull ||
              !elementData ||
              (!isIndexDataValid && view.length !== 0)}
            onClick={handleAddElementAtIndex}
            name={LinkedListActions.AddAtIndex}
          />
          <Button
            extraClass={styles.bigButton}
            text="Удалить по индексу"
            type="button"
            isLoader={isAnimating.isDeleteFromIndexAnimating}
            linkedList="big"
            disabled={indexData === undefined || isAnyButtonAnimating() || isLinkedListEmpty || !isIndexDataValid}
            onClick={handleDeleteElementAtIndex}
            name={LinkedListActions.DeleteFromIndex}
          />
        </div>
      </form>
      <div className={styles.visualization}>
        <ul className={styles.box}>
        {!!view && view.map((item, index) => {
          const isHeadElement: boolean = !!item.head && typeof item.head === "object";
          const isTailElement: boolean = !!item.tail && typeof item.tail === "object";
          const headString: string = index === 0 ? "head" : "";
          const tailString: string = index === view.length-1 ? "tail" : ""
          return (
            <li className={styles.item} key={item.key}>
              <Circle
                letter={String(item.value)}
                state={item.state}
                head={item.head && isHeadElement ? makeSmallCircle(item.head) : headString}
                tail={item.tail && isTailElement ? makeSmallCircle(item.tail): tailString}
                index={index}
              />
              {index !== view.length-1 && 
                <ArrowIcon />
              }
            </li>
          )
        })}
        </ul>
      </div>
    </SolutionLayout>
  );
};