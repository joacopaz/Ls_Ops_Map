import React, { forwardRef, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "../Mapa.module.css";
import "../App.css";

const Searchbar = forwardRef(
	(
		{ handleSubmit, setSelectedChannel, data, handleChannelCreation },
		searchRef
	) => {
		const [quickSearch, setQuickSearch] = useState(true);

		const handleChange = (e) => {
			if (e.target.value === "Create new channel")
				return handleChannelCreation();
			const channel = data.channels.find(
				(e) => `${e.data.vc} ${e.data.canal}` === searchRef.current.value
			);
			if (!channel) return;
			setSelectedChannel(channel);
			console.log(channel);
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
						<option value={`Create new channel`}></option>
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
