import React, { forwardRef } from "react";
import { Form } from "react-bootstrap";
import styles from "../Mapa.module.css";
import "../App.css";

const Searchbar = forwardRef(
	({ handleSubmit, handleChange, data }, searchRef) => {
		return (
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3" controlId="search">
					<Form.Control
						type="text"
						className={`${styles.search} w-100`}
						placeholder="Search by VC or channel name"
						onChange={handleChange}
						list="datalist"
						ref={searchRef}
						onClick={(e) => (e.target.value = "")}
					/>

					<datalist id="datalist" className={styles.dataList}>
						{data?.channels?.map((e) => {
							return (
								<option
									value={`${e.data.vc} ${e.data.canal}`}
									key={e.id}
								></option>
							);
						})}
					</datalist>
				</Form.Group>
			</Form>
		);
	}
);

export default Searchbar;
