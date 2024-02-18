import { useEffect, useRef } from "react";

export function  useMounted(): boolean  {
	const isMountedRef  = useRef(false);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {isMountedRef.current = false;} 
	}, [])

	return isMountedRef.current
}