import React, { forwardRef, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "../Mapa.module.css";
import "../App.css";

const Searchbar = forwardRef(
	({ handleSubmit, setSelectedChannel, data }, searchRef) => {
		const [quickSearch, setQuickSearch] = useState(true);

		const handleChange = (e) => {
			const channel = data.channels.find(
				(e) => `${e.data.vc} ${e.data.canal}` === searchRef.current.value
			);
			if (!channel) return;
			setSelectedChannel(channel);
		};

		return (
			<Form onSubmit={handleSubmit} className="position-relative">
				<Form.Group className="mb-3" controlId="search">
					<Form.Control
						type="text"
						className={`${styles.search} w-100`}
						placeholder={"Search by VC or channel name"}
						onChange={handleChange}
						list="datalist"
						ref={searchRef}
						onClick={(e) => (quickSearch ? (e.target.value = "") : "")}
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
					<Form.Check
						type="switch"
						id="custom-switch"
						defaultChecked={true}
						label={quickSearch ? "Quick search ON" : "Quick search OFF"}
						className={styles.toggle}
						onChange={({ target }) =>
							target.checked ? setQuickSearch(true) : setQuickSearch(false)
						}
					/>
				</Form.Group>
			</Form>
		);
	}
);

export default Searchbar;
