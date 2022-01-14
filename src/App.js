import React from "react";

import { useData } from "./utilities/firebase.js";
import { timeParts } from "./utilities/times.js";
import CourseList from "./components/CourseList";

import "./App.css";

const mapValues = (fn, obj) =>
	Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [key, fn(value)])
	);

const addCourseTimes = (course) => ({
	...course,
	...timeParts(course.meets),
});

const addScheduleTimes = (schedule) => ({
	title: schedule.title,
	courses: mapValues(addCourseTimes, schedule.courses),
});

const Banner = ({ title }) => <h1>{title}</h1>;

const App = () => {
	const [schedule, loading, error] = useData("/", addScheduleTimes);

	if (error) return <h1>{error}</h1>;
	if (loading) return <h1>Loading the schedule...</h1>;

	return (
		<div className="container">
			<Banner title={schedule.title} />
			<CourseList courses={schedule.courses} />
		</div>
	);
};

export default App;
