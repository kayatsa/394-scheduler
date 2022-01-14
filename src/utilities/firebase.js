import { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	onIdTokenChanged,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { getDatabase, onValue, ref, set } from "firebase/database";

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

export const setData = (path, value) => set(ref(database, path), value);

export const signInWithGoogle = () => {
	signInWithPopup(getAuth(app), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(app));

export { firebaseSignOut as signOut };

export const useUserState = () => {
	const [user, setUser] = useState();

	useEffect(() => {
		onIdTokenChanged(getAuth(app), setUser);
	}, []);

	return [user];
};
