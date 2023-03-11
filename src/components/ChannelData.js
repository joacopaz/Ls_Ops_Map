import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "../Mapa.module.css";
import MultiChannelAlert from "./MultiChannelAlert";
import Loader from "./Loader";
import ChannelDataColumn from "./ChannelDataColumn";
import useColumns from "../hooks/useColumns";

const ChannelData = ({ e, edit, editData, sharedVcs }) => {
	const [loaded, setLoaded] = useState(false);
	const imgRef = useRef();
	useLayoutEffect(() => {
		setLoaded(false);
		setTimeout(() => setLoaded(true), 500);
		// console.log(e);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [e]);

	// const { columns } = useColumns();

	return (
		<>
			{/* FIXED HEADER START */}
			{e.img && e.img.substring(0, 4) === "http" && !loaded ? <Loader /> : null}

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
				<ChannelDataColumn
					title={"VC"}
					column={e.vc}
					colString={"vc"}
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Nombre"}
					column={e.canal}
					colString={"canal"}
					edit={edit}
					editData={editData}
					isLong={false}
					hidden
				/>
				<ChannelDataColumn
					title={"SID"}
					column={e.sid}
					colString={"sid"}
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Horario GMT"}
					column={e.GMT}
					colString={"GMT"}
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Horario Verano"}
					column={e.GMTverano}
					colString={"GMTverano"}
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Action Pack"}
					column={e.actionPack}
					colString={"actionPack"}
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Territorio"}
					column={e.territorio}
					colString={"territorio"}
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Carga"}
					column={e.carga}
					colString="carga"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Analista"}
					column={e.analista}
					colString="analista"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Categoría"}
					column={e.categoria}
					colString="categoria"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Contacto"}
					column={e.contacto}
					colString="contacto"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Esclavo"}
					column={e.esclavo}
					colString="esclavo"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Frecuencia"}
					column={e.frecuencia}
					colString="frecuencia"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Espejos"}
					column={e.espejos}
					colString="espejos"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Grilla"}
					column={e.grid}
					colString="grid"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Horario"}
					column={e.horario}
					colString="horario"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Master"}
					column={e.master}
					colString="master"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Usuario"}
					column={e.usuario}
					colString="usuario"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Password"}
					column={e.pass}
					colString="pass"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Teléfono"}
					column={e.tel}
					colString="tel"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Página Web"}
					column={e.url}
					colString="url"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Correo"}
					column={e.correo}
					colString="correo"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Proveedor"}
					column={e.proveedor}
					colString="proveedor"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Type"}
					column={e.type}
					colString="type"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
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
				<ChannelDataColumn
					title={"Descripción"}
					column={e.spaDesc}
					colString="spaDesc"
					edit={edit}
					editData={editData}
					isLong={true}
				/>
				<ChannelDataColumn
					title={"Descripción Inglés"}
					column={e.engDesc}
					colString="engDesc"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
				<ChannelDataColumn
					title={"Observaciones"}
					column={e.obs}
					colString="obs"
					edit={edit}
					editData={editData}
					isLong={false}
				/>
			</ul>
			{/* LONG SINGLE COLS END */}
			{sharedVcs.length > 1 && !edit ? (
				<MultiChannelAlert sharedVcs={sharedVcs} />
			) : null}
		</>
	);
};

export default ChannelData;
