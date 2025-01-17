import { useState, useEffect } from 'react';
import { timeMarkToMilliseconds } from './utils';

interface TimedRenderProps {
	children: React.ReactNode;
	mode: 'for' | 'after';
	milliseconds?: number;
	seconds?: number;
	minutes?: number;
	hours?: number;
}

const TimedRender: React.FC<TimedRenderProps> = ({
	children,
	mode,
	milliseconds,
	seconds,
	minutes,
	hours,
}) => {
	const [render, setRender] = useState<boolean>(mode === 'for');

	useEffect(() => {
		const ms: number =
			!milliseconds && !seconds && !minutes && !hours
				? 0
				: timeMarkToMilliseconds({
						milliseconds,
						seconds,
						minutes,
						hours,
					});

		const timeout = setTimeout(() => {
			setRender((prev) => !prev);
		}, ms);
		return () => clearTimeout(timeout);
	}, []);

	if (render) return <>{children}</>;
	else return <></>;
};

export default TimedRender;
