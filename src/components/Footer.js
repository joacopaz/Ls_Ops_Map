import React from "react";
import styles from "../Mapa.module.css";
// import icon from "../cute-heart.png";

export default function Footer() {
	return (
		<>
			{/* <div className={styles.policy}>
				<a href="../privacy" target="_blank" alt="privacy policy">
					Privacy Policy
				</a>
				<a href="../terms" target="_blank" alt="terms of use">
					Terms of Use
				</a>
			</div> */}
			<div className={styles.build}>
				<span>Build 0.8</span>
				{/* <img src={icon} style={{ maxHeight: "15px" }}></img> */}
			</div>
		</>
	);
}
