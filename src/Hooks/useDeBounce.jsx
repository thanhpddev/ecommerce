import { useEffect } from "react";
import { useState } from "react";

const useDeBounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value]);
  return debouncedValue;
};
export default useDeBounce;
