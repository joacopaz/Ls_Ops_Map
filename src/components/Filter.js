import React from "react";
import styles from "../FilterForm.module.css";
import filter from "../filter.png";
import greenFilter from "../green-filter.png";

export default function Filter({ setSearching, searching, contentRef }) {
	return (
		<div
			className={
				!searching ? styles.filter : `${styles.filter} ${styles.isFiltering}`
			}
			onClick={() => {
				contentRef.current.style.opacity = 0;
				setTimeout(() => {
					setSearching((prev) => !prev);
					contentRef.current.style.opacity = 100;
				}, 200);
			}}
		>
			<img src={!searching ? filter : greenFilter} alt="filter DB"></img>
		</div>
	);
}
