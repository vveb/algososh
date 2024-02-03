import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import styles from './fibonacci-page.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { ViewItem } from "../../types/view.types";
import { calculateFiboGenerator } from "../../utils/generators";
import { Circle } from "../ui/circle/circle";
import { IterableViewWithNumbers } from "../../types/generator.types";

export const FibonacciPage: React.FC = () => {

  const calculateFiboGeneratorRef = useRef<IterableViewWithNumbers | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const [data, setData] = useState<number | undefined>(undefined);
  const [view, setView] = useState<ViewItem<number>[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (data) {
      calculateFiboGeneratorRef.current = calculateFiboGenerator(data);
      setIsAnimating(true);
      animationRef.current = window.setInterval(() => {
        if (calculateFiboGeneratorRef.current) {
          const { value: view, done } = calculateFiboGeneratorRef.current.next();
          if (view) {
            setView(view);
          };
          if (done) {
            window.clearInterval(animationRef.current);
            animationRef.current = 0;
            calculateFiboGeneratorRef.current = null;
            setIsAnimating(false);
          };
        };
      }, 500)
    };
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setData(Number(evt.target.value));
  };

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input extraClass={styles.input}
          max={19}
          min={1}
          isLimitText={true}
          type="number"
          value={data}
          onChange={handleInputChange}
          placeholder="Введите число"
        />
        <Button extraClass={styles.button} text="Рассчитать" type="submit" isLoader={isAnimating} disabled={isAnimating} />
      </form>
      <div className={styles.visualization}>
        {view.map((item, index) => (<Circle letter={String(item.value)} index={index} state={item.state} key={item.key} />))}
      </div>
    </SolutionLayout>
  );
};
