import React, { useEffect } from 'react';
import * as SurveyJS from "survey-react";
import firebase from 'firebase/app'
import 'firebase/firestore';
import {cspsColours, getUUID} from '../helpers';
import SurveyJSON from '../content/survey.json';
import './customSurveyJS.css';
import "survey-react/survey.css";
import styles from './Survey.module.css';

export default function Survey(props) {

    useEffect(() => {
        let button = document.createElement("button");
        button.innerHTML = props.t["Restart"];
        button.onclick = restartSurvey
        button.className = styles.restartButton + " light";

        document.querySelector(".sv_nav").appendChild(button);

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

    var defaultThemeColors = SurveyJS.StylesManager.ThemeColors["default"];

    defaultThemeColors["$main-color"] = cspsColours.grey;
    defaultThemeColors["$main-hover-color"] = cspsColours.purple;
    defaultThemeColors["$text-color"] = "black";
    defaultThemeColors["$body-container-background-color"] = "white";

    SurveyJS.StylesManager.applyTheme();

    var model = new SurveyJS.Model(SurveyJSON);
    model.locale = props.t.getLocale;

    function restartSurvey() {
        props.startSurvey(false);
    }

    async function onComplete(result) {
        props.setSurveyResults(result.data);

        let data = {
            ...result.data
        };

        let urlParams = new URLSearchParams(window.location.search);
        let event = urlParams.get('ev');

        if (event != ""){
            data.event = event;
        }

        const res = await firebase.firestore().collection('results').doc(getUUID()).set(data);
        console.log(res);
    }

    return (
        <div className={styles.container}>
            <div className={styles.survey}>
                <SurveyJS.Survey
                    model={model}
                    onComplete={onComplete}
                />
            </div>
        </div>
    );
}