import { useState, useEffect } from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBRgwNBR0Oi4jTBLnZkuR8rSialixafvy0",
	authDomain: "scheduler-ffdf9.firebaseapp.com",
	databaseURL: "https://scheduler-ffdf9-default-rtdb.firebaseio.com",
	projectId: "scheduler-ffdf9",
	storageBucket: "scheduler-ffdf9.appspot.com",
	messagingSenderId: "707081736063",
	appId: "1:707081736063:web:89f7b6b00d45b01dfdd44a",
	measurementId: "G-4NLR34D4T4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const useData = (path, transform) => {
	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();

	useEffect(() => {
		const dbRef = ref(database, path);
		const devMode =
			!process.env.NODE_ENV || process.env.NODE_ENV === "development";
		if (devMode) {
			console.log(`loading ${path}`);
		}
		return onValue(
			dbRef,
			(snapshot) => {
				const val = snapshot.val();
				if (devMode) {
					console.log(val);
				}
				setData(transform ? transform(val) : val);
				setLoading(false);
				setError(null);
			},
			(error) => {
				setData(null);
				setLoading(false);
				setError(error);
			}
		);
	}, [path, transform]);

	return [data, loading, error];
};
