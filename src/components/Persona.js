import React, { useState, useEffect } from 'react';
import personas from '../content/personas.json';
import dataLiteracyLevels from '../content/dataLiteracyLevels.json';
import './Persona.css';

export default function Persona(props) {

    const [persona, setPersona] = useState(null);

    useEffect(() => {
        if (props.surveyResults){
            findPersona();
        }
    },[props.surveyResults])

    function findPersona() {
        let found = personas.find(persona => {
            for (let skill in persona.skills){
                if (!persona.skills[skill].includes(props.surveyResults[skill])){
                    return false;
                }
            }
            return true
        });
        if (found){
            setPersona(found);
        }
        else{
            setPersona(findPersonaBackup());
        }
        
    }

    function findPersonaBackup() {

        let score = 0;

        for (let skill in props.surveyResults){
            if (typeof(props.surveyResults[skill]) === "number"){
                score += props.surveyResults[skill];
            }
        }

        let level = dataLiteracyLevels.find(level => {
            if (score >= level.score.min && score <= level.score.max){
                return true;
            }
        })

        return {
            title: `Backup weighting used: You are a ${level.title} with a score of ${score}`
        }
    }
    

    return (
        <div>
            {persona &&
                <h1>{persona.title}</h1>
            }
        </div>
    );
}