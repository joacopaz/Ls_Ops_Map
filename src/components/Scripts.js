import React from "react";

import { Button } from "react-bootstrap";
import useWrite from "../hooks/useWrite";

export default function Scripts() {
	const { del } = useWrite();
	// button for deleting history
	return (
		<Button
			onClick={async () => {
				for (let index = 1; index < 9; index++) {
					await del("history", `v0.0${index}`);
					console.log(`Deleted v0.0${index}`);
				}
			}}
		>
			CLICK ME
		</Button>
	);
}
