import React, { forwardRef, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "../Mapa.module.css";
import "../App.css";

const Searchbar = forwardRef(
	(
		{
			setSelectedChannel,
			data,
			setDeleting,
			setDeleteConfirm,
			setChannelToDelete,
			deleting,
		},
		ref
	) => {
		const [quickSearch, setQuickSearch] = useState(true);

		useEffect(() => {
			if (!deleting) ref.current.focus();
		});

		const handleSubmit = (e) => {
			e.preventDefault();
			// run search function
			const channel = data.channels.find(
				(e) => `${e.data.vc} ${e.data.canal}` === ref.current.value
			);
			if (channel) return setSelectedChannel(channel);
			const closestMatch = data.channels.find(
				(e) => Number(ref.current.value.match(/(\d+)/)[1]) === e.data.vc
			);
			if (closestMatch) setSelectedChannel(closestMatch);
		};
		const handleChange = (e) => {
			const channel = data.channels.find(
				(e) => `${e.data.vc} ${e.data.canal}` === ref.current.value
			);
			if (!channel) return;
			if (deleting) {
				setDeleting(false);
				setDeleteConfirm(false);
				setChannelToDelete({});
			}
			setSelectedChannel(channel);
		};

		return (
			<Form onSubmit={handleSubmit} className="position-relative mt-3 mb-3">
				<Form.Group controlId="search">
					{!deleting ? (
						<Form.Control
							type="text"
							className={`${styles.search}`}
							placeholder={"Search by VC or channel name"}
							onChange={handleChange}
							list="datalist"
							ref={ref}
							onClick={(e) => (quickSearch ? (e.target.value = "") : "")}
						/>
					) : null}
					<datalist id="datalist">
						{data?.channels?.map((e) => {
							return (
								<option
									value={`${e.data.vc} ${e.data.canal}`}
									key={e.id}
								></option>
							);
						})}
					</datalist>
					{!deleting ? (
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
					) : null}
				</Form.Group>
			</Form>
		);
	}
);

export default Searchbar;
