import React, { useLayoutEffect, useRef, useState } from "react";
import styles from "../Mapa.module.css";
import MultiChannelAlert from "./MultiChannelAlert";
import Loader from "./Loader";
import ChannelDataColumn from "./ChannelDataColumn";

const ChannelData = ({ e, edit, editData, sharedVcs, columns }) => {
	const [loaded, setLoaded] = useState(false);
	const imgRef = useRef();
	useLayoutEffect(() => {
		setLoaded(false);
		setTimeout(() => {
			setLoaded(true);
		}, 500);
		// console.log(e);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [e]);

	const orderedColumns = columns?.sort((a, b) => a.data.order - b.data.order);
	return (
		<>
			{/* FIXED HEADER START */}
			{e.img && e.img.substring(0, 4) === "http" && !loaded ? (
				<Loader message="Loading img..." />
			) : null}

			{e.img && e.img.substring(0, 4) === "http" ? (
				<img
					className={styles.cardImg}
					src={e.img}
					alt={` `}
					onLoad={(e) => {
						setLoaded(true);
					}}
					ref={imgRef}
				></img>
			) : null}
			<h5 className={styles.title}>{e.canal}</h5>
			<ul className={`${styles.ul} ${styles.split} ${edit ? styles.edit : ""}`}>
				{/* FIXED HEADER END */}

				{/* SHORT DOUBLE COLS START*/}
				{orderedColumns?.map((column, i) => {
					if (column.data.isLong) return null;
					return (
						<ChannelDataColumn
							title={column.data.title}
							column={e[column.data.column]}
							colString={column.data.column}
							edit={edit}
							editData={editData}
							isLong={false}
							key={i}
							hidden={column.data.hidden}
						/>
					);
				})}
			</ul>
			{/* SHORT DOUBLE COLS END */}

			{/* LONG SINGLE COLS START */}
			<ul
				className={`${styles.ul} ${edit ? styles.edit : ""}`}
				style={{ paddingTop: "0", paddingBottom: "1rem" }}
			>
				<ChannelDataColumn
					title={"Logo (URL)"}
					column={e.img}
					colString={"img"}
					edit={edit}
					editData={editData}
					isLong={false}
					hidden
				/>
				{orderedColumns?.map((column, i) => {
					if (!column.data.isLong) return null;
					return (
						<ChannelDataColumn
							title={column.data.title}
							column={e[column.data.column]}
							colString={column.data.column}
							edit={edit}
							editData={editData}
							isLong={false}
							key={i}
							hidden={column.data.hidden}
						/>
					);
				})}
			</ul>
			{/* LONG SINGLE COLS END */}
			{sharedVcs.length > 1 && !edit ? (
				<MultiChannelAlert sharedVcs={sharedVcs} />
			) : null}
		</>
	);
};

export default ChannelData;
