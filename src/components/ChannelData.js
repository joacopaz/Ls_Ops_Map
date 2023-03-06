import React, { useLayoutEffect, useRef, useState } from "react";
import styles from "../Mapa.module.css";
import { Button } from "react-bootstrap";
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [e]);
	// const { columns } = useColumns();
	return (
		<>
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
				{edit ? (
					<li>
						<strong>Logo (URL):</strong> {e.img ? e.img : "-"}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="img"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}

				<ChannelDataColumn
					title={"VC"}
					column={e.vc}
					edit={edit}
					editData={editData}
					isLong={false}
					defaultView={true}
				/>
				<ChannelDataColumn
					title={"SID"}
					column={e.sid}
					edit={edit}
					editData={editData}
					isLong={false}
					defaultView={true}
				/>
				<ChannelDataColumn
					title={"Nombre"}
					column={e.canal}
					edit={edit}
					editData={editData}
					isLong={false}
					defaultView={false}
				/>
				<ChannelDataColumn
					title={"Horario GMT"}
					column={e.GMT}
					edit={edit}
					editData={editData}
					isLong={false}
					defaultView={true}
				/>
				<ChannelDataColumn
					title={"Horario Verano"}
					column={e.GMTverano}
					edit={edit}
					editData={editData}
					isLong={false}
					defaultView={true}
				/>
				<ChannelDataColumn
					title={"Action Pack"}
					column={e.actionPack}
					edit={edit}
					editData={editData}
					isLong={false}
					defaultView={true}
				/>
				<ChannelDataColumn
					title={"Territorio"}
					column={e.territorio}
					edit={edit}
					editData={editData}
					isLong={false}
					defaultView={true}
				/>

				{e.carga !== "-" || edit ? (
					<li>
						<strong>Carga:</strong>
						{e.carga}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="carga"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.analista !== "-" || edit ? (
					<li>
						<strong>Analista:</strong>
						{e.analista}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="analista"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}

				{e.categoria !== "-" || edit ? (
					<li>
						<strong>Categoria:</strong>
						{e.categoria}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="categoria"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.contacto !== "-" || edit ? (
					<li>
						<strong>Contacto:</strong>
						{e.contacto}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="contacto"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}

				{e.esclavo !== "-" || edit ? (
					<li>
						<strong>Esclavo:</strong>
						{e.esclavo}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="esclavo"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.frecuencia !== "-" || edit ? (
					<li>
						<strong>Frecuencia:</strong>
						{e.frecuencia}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="frecuencia"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.espejos !== "-" || edit ? (
					<li>
						<strong>Espejos:</strong>
						{e.espejos}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="espejos"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.grid !== "-" || edit ? (
					<li>
						<strong>Grid:</strong>
						{e.grid}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="grid"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.horario !== "-" || edit ? (
					<li>
						<strong>Horario:</strong>
						{e.horario}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="horario"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.master !== "-" || edit ? (
					<li>
						<strong>Master:</strong>
						{e.master}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="master"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.usuario !== "-" || edit ? (
					<li>
						<strong>Usuario:</strong>
						{e.usuario}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="usuario"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.pass !== "-" || edit ? (
					<li>
						<strong>Password:</strong>
						{e.pass}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="pass"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.tel !== "-" || edit ? (
					<li>
						<strong>Teléfono:</strong>
						{e.tel}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="tel"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}

				{e.url !== "-" || edit ? (
					<li>
						<strong>Página Web:</strong>
						{e.url}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="url"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.correo !== "-" || edit ? (
					<li>
						<strong>Correo:</strong>
						{e.correo}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="correo"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.proveedor !== "-" || edit ? (
					<li>
						<strong>Proveedor:</strong>
						{e.proveedor}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="proveedor"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				<ChannelDataColumn
					title={"Type"}
					column={e.type}
					edit={edit}
					editData={editData}
					isLong={false}
					defaultView={true}
				/>
			</ul>
			<ul
				className={`${styles.ul} ${edit ? styles.edit : ""}`}
				style={{ paddingTop: "0", paddingBottom: "1rem" }}
			>
				{e.spaDesc !== "-" || edit ? (
					<li>
						<strong>Descripción:</strong>
						{e.spaDesc}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="spaDesc"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.engDesc !== "-" || edit ? (
					<li>
						<strong>Descripción Inglés:</strong>
						{e.engDesc}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="engDesc"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.obs !== "-" || edit ? (
					<li>
						<strong>Observaciones:</strong>
						{e.obs}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="obs"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
			</ul>
			{sharedVcs.length > 1 && !edit ? (
				<MultiChannelAlert sharedVcs={sharedVcs} />
			) : null}
		</>
	);
};

export default ChannelData;
