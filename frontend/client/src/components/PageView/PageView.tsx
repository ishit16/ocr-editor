import ToolBar from "./ToolBar";
import { Stage, Layer, Text } from "react-konva";
import { useMeasure } from "react-use";
import React, { useState, useEffect, useLayoutEffect } from "react";
import ImageView from "./ImageView";
import { useAppReducer } from "../../reducerContext";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { loadImageUtil } from "../../utils";
import {
	loadImage,
	loadHocr,
	logInfo,
	changeCurPage,
} from "../../reducer/actions";
import doOcr from "../../lib/doOcr";
import HocrLayer from "./components/HocrLayer";
import HocrView from "./HocrView";
import axios from "axios";

function PageViewer() {
	const [state, dispatch] = useAppReducer();
	const parsed = queryString.parse(window.location.search);
	const [curZoom, setCurZoom] = useState(1);
	const [bookDetails, setBookDetails] = useState(null);

	const handleZoom = (zoomDelta: int) => {
		setCurZoom(curZoom + zoomDelta);
	};

	
	const [imgMeasureRef, { width, height }] = useMeasure();

	useEffect(() => {
		if (!parsed?.p) {
			parsed.p = "1";
		}
		if (parsed?.b) {
		axios.get(
			process.env.REACT_APP_SERVER_URL + "/books/" + parsed.b
		).then((response) => setBookDetails(response.data));
	}

		dispatch(changeCurPage(parseInt(parsed.p)));
		//uu10.129.6.78:5000/h/b/1/p/2
		/* const imageurl =
			process.env.REACT_APP_SERVER_URL +
			"/i/b/" +
			parsed?.b +
			"/p/" +
			parsed?.p; */

		//	if (!state.pageImage) {
		//	}
	}, []);

	return (
		<>
			<nav className="navbar navbar-expand-md shadow-sm rounded p-0 m-0">
				<div className="container-fluid py-0">
					<Link
						className="navbar-brand"
						to="/cli"
					>
						<span className="px-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="42"
								height="42"
								fill="currentColor"
								class="bi bi-arrow-left-circle"
								viewBox="0 0 16 16"
							>
								<path
									fillRule="evenodd"
									d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
								/>
							</svg>
						</span>
						Sandhi
						<span className="navbar-subbrand px-2">
							Page Viewer
						</span>
					</Link>
					<span className="navbar-text px-3 me-auto">
						{bookDetails?.title}
					</span>
				</div>
			</nav>

			<ToolBar
				curPageno={state.curPageno}
				dispatch={dispatch}
				fnSetCurZoom={handleZoom}
			/>
			<div className="container-fluid pv-container pt-2 pb-4 px-2">
				<div className="row wh-90 vh-100 border shadow">
					<div
						className="col-md-6 shadow"
						ref={imgMeasureRef}
					>
						<div className="p-3 border pv-pane">
							<Stage
								width={
									(state
										.pageImage
										?.curWidth !==
									0
										? state
												.pageImage
												?.curWidth
										: width) *
									curZoom
								}
								height={
									(state
										.pageImage
										?.curHeight !==
									0
										? state
												.pageImage
												?.curHeight
										: height) *
									curZoom
								}
							>
								{!state.pageImage && (
									<Layer>
										<Text
											text={
												state
													.pageImage
													?.urlObject
											}
										/>
									</Layer>
								)}
								<Layer>
									<ImageView
										pageImage={
											state.pageImage
										}
										width={
											(state
												.pageImage
												?.curWidth !==
											0
												? state
														.pageImage
														?.curWidth
												: width) *
											curZoom
										}
										height={
											(state
												.pageImage
												?.curHeight !==
											0
												? state
														.pageImage
														?.curHeight
												: height) *
											curZoom
										}
									/>
								</Layer>
								<HocrLayer
									page={
										state.hocrPage
									}
									dispatch={
										dispatch
									}
									pageImage={
										state.pageImage
									}
									width={
										(state
											.pageImage
											?.curWidth !==
										0
											? state
													.pageImage
													?.curWidth
											: width) *
										curZoom
									}
									height={
										(state
											.pageImage
											?.curHeight !==
										0
											? state
													.pageImage
													?.curHeight
											: height) *
										curZoom
									}
									hoverId={
										state.hoverId
									}
								/>
							</Stage>
						</div>
					</div>
					<div className="col-md-6 shadow">
						<div className="p-3 border pv-pane">
							<HocrView
								page={
									state.hocrPage
								}
								hoverId={
									state.hoverId
								}
								dispatch={
									dispatch
								}
							/>
						</div>
					</div>
				</div>
				<div className="row fixed-bottom">
					<div className="col-md-6 offset-md-4 px-3">
						{state.logInfo}
					</div>
				</div>
			</div>
		</>
	);
}

export default PageViewer;
