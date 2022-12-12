import React from "react";
import styles from "../Mapa.module.css";
import { Button } from "react-bootstrap";
const ChannelData = ({ e, edit, editData }) => {
	return (
		<>
			{e.img && e.img.substring(0, 4) === "http" ? (
				<img className={styles.cardImg} src={e.img} alt={` `}></img>
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
				{e.vc !== "-" || edit ? (
					<li>
						<strong>VC:</strong>
						{e.vc}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="vc"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{edit ? (
					<li>
						<strong>Nombre:</strong> {e.canal}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="canal"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.GMT !== "-" || edit ? (
					<li>
						<strong>Horario GMT:</strong> {e.GMT.replace(/[()]/g, "")}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="GMT"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.GMTverano !== "-" || edit ? (
					<li>
						<strong>Horario verano:</strong>
						{e.GMTverano.replace(/[()]/g, "")}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="GMTverano"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.actionPack !== "-" || edit ? (
					<li>
						<strong>Action pack:</strong>
						{e.actionPack}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="actionPack"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
				{e.territorio !== "-" || edit ? (
					<li>
						<strong>Territorio:</strong>
						{e.territorio}
						{edit ? (
							<Button
								variant="outline-danger"
								size="sm"
								className={styles.editBtn}
								onClick={(e) => editData(e.target.dataset.edit)}
								data-edit="territorio"
							>
								Edit
							</Button>
						) : null}
					</li>
				) : null}
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
			</ul>
			<ul className={`${styles.ul} ${edit ? styles.edit : ""}`}>
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
		</>
	);
};

export default ChannelData;
