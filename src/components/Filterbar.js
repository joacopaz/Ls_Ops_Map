import React, { useRef, useLayoutEffect, useContext, useState } from "react";
import { Form, DropdownButton } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import styles from "../FilterForm.module.css";
import { FilterContext } from "./Dashboard";

const FilterBar = () => {
	const ref = useRef(null);
	const dropdownRef = useRef(null);
	useLayoutEffect(() => {
		ref.current.focus();
	}, [ref]);
	const { setResults, filter, setFilter } = useContext(FilterContext);
	const [timer, setTimer] = useState(null);
	const handleChange = () => {
		if (timer) clearTimeout(timer);
		setTimer(
			setTimeout(() => {
				handleSubmit();
			}, 1200)
		);
	};

	function handleSubmit() {
		console.log("Submit");
		setResults("");
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
						title="Filtrar por columna"
						ref={dropdownRef}
						style={{
							position: "absolute",
							right: "0",
							transform: "translate(110%,0)",
							width: "200px",
						}}
					>
						<DropdownItem
							style={{ color: "gray" }}
							onClick={() => {
								dropdownRef.current.firstChild.firstChild.data =
									"Filtrar por columna";
								ref.current.value = "";
								ref.current.focus();
								setFilter(null);
							}}
						>
							(blank)
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
										setFilter(col.data.title);
									}}
								>
									{col.data.title}
								</DropdownItem>
							);
						})}
					</DropdownButton>
				</div>
				<Form.Control
					type="text"
					className={`${styles.search} ${styles.filtering}`}
					placeholder={filter ? `Search in ${filter}` : "Search by keywords"}
					list="datalist"
					ref={ref}
					onChange={handleChange}
				/>
				<datalist id="datalist">
					{/* {data?.channels?.map((e) => {
						return (
							<option
								value={`${e.data.vc} ${e.data.canal}`}
								key={e.id}
							></option>
						);
					})} */}
				</datalist>
			</Form.Group>
			<Form.Text className="text-center w-100" as="div">
				and &, or /
			</Form.Text>
		</Form>
	);
};

export default FilterBar;
