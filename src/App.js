import React, { useEffect, useState } from 'react';
import CsvDownload from 'react-json-to-csv';
import firebase from 'firebase/app';
import 'firebase/firestore';
import personas from './content/personas.json';
import dataLiteracyLevels from './content/dataLiteracyLevels.json';

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

        resultsArray = resultsArray.map(result => {
            result = findPersona(result);
            result = findLiteracyLevel(result);
            return result;
        });

        // A numerical 0 appears blank in spreadsheet, so making it into a string
        resultsArray.forEach(result => {
            for (const property in result) {
                if (result[property] === 0){
                    result[property] = "0";
                }
            }
        });

        setResults(resultsArray);
    }

    function findPersona(surveyResults) {
        let found;
        personas.forEach(persona => {
            let skillCount = 0;
            let skillsFound = 0;
            for (let skill in persona.skills){
                if (persona.skills[skill].includes(surveyResults[skill])){
                    skillsFound++;
                }
                skillCount++;
            }

            let personaPercentage = skillsFound / skillCount;

            if (!found || personaPercentage > found.personaPercentage){
                found = {
                    personaPercentage: personaPercentage,
                    ...persona
                };
            }

        });
        surveyResults.persona = found.title;
        return surveyResults;
    }

    function findLiteracyLevel(surveyResults) {

        let score = 0;

        for (let skill in surveyResults){
            if (typeof(surveyResults[skill]) === "number"){
                score += surveyResults[skill];
            }
        }

        let level = dataLiteracyLevels.find(level => {
            if (score >= level.score.min && score <= level.score.max){
                return true;
            }
        })

        surveyResults.literacyLevel = level.title;
        return surveyResults;
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