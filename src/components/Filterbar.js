import React, { useRef, useEffect, useContext, useState } from "react";
import { Form, DropdownButton, Spinner } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import styles from "../FilterForm.module.css";
import { FilterContext } from "./Dashboard";

const getUnique = (results, filter) => {
	const uniqueArray = [];
	results.forEach((result) => {
		if (uniqueArray.includes(result.data[filter])) return;
		uniqueArray.push(result.data[filter]);
	});
	return uniqueArray.sort();
};

const FilterBar = () => {
	const ref = useRef(null);
	const dropdownRef = useRef(null);
	useEffect(() => {
		ref.current.focus();
	}, [ref]);
	useEffect(() => {
		handleSubmit();
	}, []);

	const { results, setResults, filter, setFilter } = useContext(FilterContext);

	const [timer, setTimer] = useState(null);
	const [searching, setSearching] = useState(false);
	const handleChange = () => {
		setSearching(true);
		if (timer) clearTimeout(timer);
		setTimer(
			setTimeout(() => {
				handleSubmit();
			}, 400)
		);
	};

	const cols = JSON.parse(localStorage.getItem("columns"));
	const getTitle = (col) => {
		return cols.find((column) => column.data.column === col).data.title;
	};

	const channels = JSON.parse(localStorage.getItem("channels"));

	function handleSubmit() {
		setResults("");
		sessionStorage.setItem("term", ref.current.value);
		if (filter) {
			const results = channels.filter((channel) =>
				channel.data[filter]
					.toString()
					.toLowerCase()
					.includes(ref.current.value.toLowerCase())
			);
			setResults(results);
		}
		if (!filter) {
			// const results = channels.filter((channel) =>
			// 	channel.data[filter]
			// 		.toString()
			// 		.toLowerCase()
			// 		.includes(ref.current.value.toLowerCase())
			// );
			// setResults(results);
		}

		setSearching(false);
	}

	return (
		<Form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			className="position-relative mt-3 mb-3"
		>
			<Form.Group controlId="search">
				<div>
					<DropdownButton
						className={styles.dropdown}
						title={filter ? getTitle(filter) : "Filtrar por columna"}
						ref={dropdownRef}
						style={{
							position: "absolute",
							right: "0",
							transform: "translate(110%,0)",
							width: "200px",
							zIndex: "500",
						}}
					>
						<DropdownItem
							style={{ color: "gray" }}
							onClick={() => {
								dropdownRef.current.firstChild.firstChild.data =
									"Filtrar por columna";
								ref.current.value = "";
								ref.current.focus();
								sessionStorage.removeItem("filter");
								setFilter(null);
							}}
						>
							(ninguna)
						</DropdownItem>
						{JSON.parse(localStorage.getItem("columns")).map((col) => {
							return (
								<DropdownItem
									key={col.data.column}
									onClick={() => {
										dropdownRef.current.firstChild.firstChild.data =
											col.data.title;
										ref.current.value = "";
										ref.current.focus();
										sessionStorage.setItem("filter", col.data.column);
										setFilter(col.data.column);
										setTimeout(handleSubmit, 50);
									}}
								>
									{col.data.title}
								</DropdownItem>
							);
						})}
					</DropdownButton>
				</div>
				<div className={styles.searchBarContainer}>
					{searching ? (
						<Spinner className={styles.loading} variant="primary" />
					) : null}
					<Form.Control
						type="text"
						className={`${styles.search} ${styles.filtering}`}
						placeholder={
							filter ? `Search in ${getTitle(filter)}` : "Search by keywords"
						}
						list="datalist"
						ref={ref}
						onChange={handleChange}
						defaultValue={sessionStorage.getItem("term")}
					/>
					<datalist id="datalist">
						{results?.length > 0
							? getUnique(results, filter).map((unq, i) => (
									<option key={i}>{unq}</option>
							  ))
							: null}
					</datalist>
				</div>
			</Form.Group>
			<Form.Text className="text-center w-100" as="div">
				and &, or /
			</Form.Text>
		</Form>
	);
};

export default FilterBar;
