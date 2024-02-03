import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import styles from './string.module.css';
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ViewItem } from "../../types/view.types";
import { DELAY } from "../../utils/constants";
import { reverseStringGenerator } from "../../utils/generators";
import { IterableViewWithStrings } from "../../types/generator.types";

export const StringComponent: React.FC = () => {

  const reverseStringGeneratorRef = useRef<IterableViewWithStrings | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  
  const [data, setData] = useState<string>('');
  const [view, setView] = useState<ViewItem<string>[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setData(evt.target.value);
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    reverseStringGeneratorRef.current = reverseStringGenerator(data);
    setIsAnimating(true);
    animationRef.current = window.setInterval(() => {
      if (reverseStringGeneratorRef.current) {
        const { value: view, done } = reverseStringGeneratorRef.current.next();
        if (view) {
          setView(view);
        };
        if (done) {
          window.clearInterval(animationRef.current);
          animationRef.current = 0;
          reverseStringGeneratorRef.current = null;
          setIsAnimating(false);
        };
      };
    }, DELAY);
  };

  return (
    <SolutionLayout title="Строка">
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input extraClass={styles.input} maxLength={11} isLimitText={true} value={data} onChange={handleInputChange}></Input>
        <Button text='Развернуть' type="submit" isLoader={isAnimating} disabled={isAnimating}></Button>
      </form>
      <div className={styles.visualization}>
        {view.map((item) => (<Circle letter={item.value} state={item.state} key={item.key} />))}
      </div>
    </SolutionLayout>
  );
};
