import React from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import styles from './string.module.css';
import { Button } from "../ui/button/button";

export const StringComponent: React.FC = () => {
  return (
    <SolutionLayout title="Строка">
      <div className={styles.container}>
        <Input extraClass={styles.input} maxLength={11} isLimitText={true}></Input>
        <Button text='Развернуть'></Button>
      </div>
    </SolutionLayout>
  );
};
