import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import styles from './string.module.css';
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ViewItem } from "../../types/view.types";
import { reverseStringGenerator } from "../../utils/generators";
import { IterableViewWithStrings } from "../../types/generator.types";
import { useMounted } from "../../hooks/use-mounted.hook";
import { DELAY_IN_MS } from "../../constants/delays";

export const StringComponent: React.FC = () => {

  const isAlive = useMounted();

  const reverseStringGeneratorRef = useRef<IterableViewWithStrings | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  
  const [inputData, setInputData] = useState('');
  const [view, setView] = useState<ViewItem<string>[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputData(evt.target.value);
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    reverseStringGeneratorRef.current = reverseStringGenerator(inputData);
    setIsAnimating(true);
    animationRef.current = window.setInterval(() => {
      if (isAlive) {
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
      };
    }, DELAY_IN_MS);
  };

  return (
    <SolutionLayout title="Строка">
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input extraClass={styles.input} maxLength={11} isLimitText={true} value={inputData} onChange={handleInputChange}></Input>
        <Button text='Развернуть' type="submit" isLoader={isAnimating} disabled={isAnimating}></Button>
      </form>
      <div className={styles.visualization}>
        {view.map((item) => (<Circle letter={item.value} state={item.state} key={item.key} />))}
      </div>
    </SolutionLayout>
  );
};
