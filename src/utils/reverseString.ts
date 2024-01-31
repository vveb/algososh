const reverseString = (str: string): string[][] => {
  let current: string[] = str.split('');
  const res: string[][] = []
  let temp;
  res.push([...current]);
  for (let i=0; i < Math.floor(current.length/2); i++) {
    temp = current[i];
    current[i] = current[current.length-i-1];
    current[current.length-i-1] = temp;
    res.push([...current]);
  }
  return res;
}

export default reverseString;