import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import styles from './fibonacci-page.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { ViewItem } from "../../types/view.types";
import { calculateFiboGenerator } from "../../utils/generators";
import { Circle } from "../ui/circle/circle";
import { IterableViewWithNumbers } from "../../types/generator.types";
import { useMounted } from "../../hooks/use-mounted.hook";

export const FibonacciPage: React.FC = () => {

  /*
  isAlive сделано с помощью кастомного хука, чтобы избежать ошибки, когда
  компонент размонтируется до того, как закончится исполнение асинхронного действия,
  например, в setTimeOut или setInterval
  */
 
  const isAlive = useMounted();

  const calculateFiboGeneratorRef = useRef<IterableViewWithNumbers | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const [data, setData] = useState<number>(0);
  const [view, setView] = useState<ViewItem<number>[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (data) {
      calculateFiboGeneratorRef.current = calculateFiboGenerator(data);
      setIsAnimating(true);
      animationRef.current = window.setInterval(() => {
        if (isAlive) {
          if (calculateFiboGeneratorRef.current) {
            const { value: view, done } = calculateFiboGeneratorRef.current.next();
            if (view) {
              setView(view);
            };
            if (done) {
              window.clearInterval(animationRef.current);
              animationRef.current = 0;
              calculateFiboGeneratorRef.current = null;
              setData(0);
              setIsAnimating(false);
            };
          };
        };
      }, 500);
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
          disabled={isAnimating}
        />
        <Button extraClass={styles.button} text="Рассчитать" type="submit" isLoader={isAnimating} disabled={isAnimating} />
      </form>
      <div className={styles.visualization}>
        {view.map((item, index) => (<Circle letter={String(item.value)} index={index} state={item.state} key={item.key} />))}
      </div>
    </SolutionLayout>
  );
};
