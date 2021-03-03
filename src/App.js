import React, { useEffect, useState } from 'react';
import CsvDownload from 'react-json-to-csv';
import firebase from 'firebase/app';
import 'firebase/firestore';

export default function App(props) {

    const [results, setResults] = useState(null);

    useEffect(() => {
        try {
            // Your web app's Firebase configuration
            // For Firebase JS SDK v7.20.0 and later, measurementId is optional
            var firebaseConfig = {
                apiKey: "AIzaSyCRTDb00DqmQxGAbafGBR6Y6QBuF5EUvu4",
                authDomain: "data-literacy-assessment-2020.firebaseapp.com",
                projectId: "data-literacy-assessment-2020",
                storageBucket: "data-literacy-assessment-2020.appspot.com",
                messagingSenderId: "131754955393",
                appId: "1:131754955393:web:dc2d47ce70d35cdbaa7380",
                measurementId: "G-2RRJL725SY"
            };
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            firebase.analytics();
        } catch (error) {
            // console.error(error);
        }
    },[]);

    async function getResults() {
        const snapshot = await firebase.firestore().collection('results').get();
        let resultsArray = [];
        snapshot.forEach(doc => {
            resultsArray.push(doc.data());
        });
        console.log(resultsArray);
        setResults(resultsArray);
    }

    return (
        <div>
            <h1>Hello World!</h1>
            <button onClick={getResults}>Get Results</button>
            {results &&
                <CsvDownload data={results} filename="Data Literacy Assessment Results.csv"/>
            }
        </div>
    );
}