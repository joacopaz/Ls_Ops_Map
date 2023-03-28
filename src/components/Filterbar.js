import React, { useRef, useEffect, useContext, useState } from "react";
import { Form, DropdownButton, Spinner } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import styles from "../FilterForm.module.css";
import { FilterContext } from "./Dashboard";

const splitString = (inputString, splitter, includeSplitter) => {
	const outputArray = inputString.split(splitter);
	if (includeSplitter) {
		outputArray.splice(1, 0, splitter);
	}
	return outputArray.map((ele) => ele.trim());
};

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		const query = ref.current.value.trim().toLowerCase();
		sessionStorage.setItem("term", query);
		let isAnd = false;
		let isOr = false;
		let params = null;
		if (query.includes("&")) {
			isAnd = true;
			isOr = false;
			params = splitString(query, "&", false);
		}
		if (query.includes("/")) {
			isAnd = false;
			isOr = true;
			params = splitString(query, "/", false);
		}
		if (isAnd && query.includes("/")) {
			alert("Por favor elegir sólo 1, & o /, no ambos");
			ref.current.value = ref.current.value.slice(0, -1);
		}
		if (isOr && query.includes("&")) {
			alert("Por favor elegir sólo 1, & o /, no ambos");
			ref.current.value = ref.current.value.slice(0, -1);
		}
		if (filter) {
			let results;
			if (!isAnd && !isOr)
				results = channels.filter((channel) =>
					channel.data[filter].toString().toLowerCase().includes(query)
				);
			if (isAnd && !isOr) {
				results = channels.filter((channel) => {
					const allMatch = params.map((param) =>
						channel.data[filter].toString().toLowerCase().includes(param)
					);
					if (allMatch.some((ele) => ele === false)) return false;
					return true;
				});
			}
			if (isOr && !isAnd) {
				results = channels.filter((channel) => {
					const anyMatch = params.map((param) =>
						channel.data[filter].toString().toLowerCase().includes(param)
					);
					if (anyMatch.some((ele) => ele === true)) return true;
					return false;
				});
			}

			setResults(results);
		}
		if (!filter) {
			const results = [];
			if (!isAnd && !isOr)
				channels.forEach((channel) => {
					const { data } = channel;
					const matches = [];
					for (const key in data) {
						if (Object.hasOwnProperty.call(data, key)) {
							const element = data[key];
							if (element.toString().toLowerCase().includes(query)) {
								matches.push(key);
							}
						}
					}
					if (matches.length > 0)
						results.push({
							...channel,
							data: { ...channel.data, matchedAt: matches },
						});
				});

			if (isAnd && !isOr)
				channels.forEach((channel) => {
					const { data } = channel;
					const matches = [];
					const values = [];
					for (const key in data) {
						if (Object.hasOwnProperty.call(data, key)) {
							const element = data[key];
							params.forEach((param) => {
								if (element.toString().toLowerCase().includes(param)) {
									matches.push(key);
									values.push(element.toString().toLowerCase());
								}
							});
						}
					}

					const allMatch = params
						.map((param) => values.some((val) => val.includes(param)))
						.every((val) => val === true);

					if (matches.length > 0 && allMatch)
						results.push({
							...channel,
							data: { ...channel.data, matchedAt: matches },
						});
				});

			if (!isAnd && isOr)
				channels.forEach((channel) => {
					const { data } = channel;
					const matches = [];
					for (const key in data) {
						if (Object.hasOwnProperty.call(data, key)) {
							const element = data[key];
							params.forEach((param) => {
								if (element.toString().toLowerCase().includes(param)) {
									matches.push(key);
								}
							});
						}
					}

					if (matches.length > 0)
						results.push({
							...channel,
							data: { ...channel.data, matchedAt: matches },
						});
				});

			setResults(results);
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
