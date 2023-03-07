import React, { forwardRef, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "../Mapa.module.css";
import "../App.css";

const Searchbar = forwardRef(
	(
		{
			setSelectedChannel,
			data,
			handleChannelCreation,
			handleChannelDeletion,
			setDeleting,
			setDeleteConfirm,
			setChannelToDelete,
			deleting,
		},
		ref
	) => {
		const [quickSearch, setQuickSearch] = useState(true);

		useEffect(() => {
			ref.current.focus();
		});

		const handleSubmit = (e) => {
			e.preventDefault();
			if (ref.current.value === "Create new channel") {
				return;
			}
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
			if (e.target.value === "Create new channel")
				return handleChannelCreation();
			if (e.target.value === "Delete existing channel")
				return handleChannelDeletion();
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
					<Form.Control
						type="text"
						className={`${styles.search} w-100`}
						placeholder={"Search by VC or channel name"}
						onChange={handleChange}
						list="datalist"
						ref={ref}
						onClick={(e) => (quickSearch ? (e.target.value = "") : "")}
					/>

					<datalist id="datalist">
						{data?.channels?.map((e) => {
							return (
								<option
									value={`${e.data.vc} ${e.data.canal}`}
									key={e.id}
								></option>
							);
						})}
						<option value={`Create new channel`}></option>
						<option value={`Delete existing channel`}></option>
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
