import { useState, useRef, useEffect } from 'react';
import './App.css';
import Countdown, { zeroPad } from 'react-countdown';
import history from './services/history';
// import trainingsService from './services/trainings';

const App = () => {
    // const [trainings, setTrainigs] = useState();
    const [historyToDisplay, setHistoryToDisplay] = useState([]);
    const [counter, setCounter] = useState();
    const [timer, toggleTimer] = useState(false);
    const clockRef = useRef();
    const [currentTraining, setCurrentTraining] = useState(0);

    // useEffect(() => {
    //   setHistory(history.getAll());
    //   // .then(data => {
    //   //   setHistory(data);
    //   // });
    //   console.log('here: ', historyToDisplay);
    // }, []);

    // useEffect(() => {
    //   personService
    //     .getAll()
    //     .then(initialPersons => {
    //       setPersons(initialPersons);
    //     });
    // }, []);


    let trainings = [
        [
            { name: 'ex rtghnyj 1', series: 3, repeat: 15, przerwa: 45 },
            { name: 'ex derrbn  2', series: 3, repeat: 12, przerwa: 50 },
            { name: 'ex   rth thr3', series: 4, repeat: 8, przerwa: 60 },
        ],
        [
            { name: 'ex 1', series: 3, repeat: 15, przerwa: 45 },
            { name: 'ex  2', series: 3, repeat: 12, przerwa: 50 },
            { name: 'ex thr3', series: 4, repeat: 8, przerwa: 60 },
        ],
        [
            { name: 'mmm 1', series: 3, repeat: 15, przerwa: 45 },
            { name: 'mmm  2', series: 3, repeat: 12, przerwa: 50 },
            { name: 'emmmx thr3', series: 4, repeat: 8, przerwa: 60 },
        ]
    ];


    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return null;
        } else {
            return <p className="timer">{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</p>;
        }
    };

    const handleChange = (e) => {
        const count = Number(e.target.value);
        toggleTimer(true);
        setCounter(Date.now() + count * 1000);
        if (clockRef.current) {
            clockRef.current.start();
        }
    };

    const handleClick = (e) => {
        const noOfTraining = e.target.value;
        setCurrentTraining(noOfTraining);
        console.log(noOfTraining);


    };

    const saveTraining = () => {
        const date = new Date();
        const parsedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        history.create({ date: parsedDate });
        console.log(parsedDate);
    };

    const historyClick = () => {
        history.getAll().then((gotHistory) => {
            setHistoryToDisplay(gotHistory);
            console.log('historyClick1 ', gotHistory);
        });
    };

    return (
        <div>
            {console.log('sdfghgf   ', historyToDisplay)}
            {historyToDisplay ? historyToDisplay.map(entry => <p> {entry.date} </p>) : null}
            {trainings.map(training => <button value={trainings.indexOf(training)} onClick={handleClick}> Training {trainings.indexOf(training) + 1} </button>)}
            <button onClick={historyClick}> History </button>
            {timer
                ? <Countdown
                    date={counter}
                    renderer={renderer}
                    ref={clockRef}
                />
                : null}
            {
                trainings[currentTraining].map(exercise => <div key={exercise.name + 'h'}>
                    <h3 key={exercise.name}> {exercise.name} </h3>
                    <table key={exercise.name + 'f'}>
                        <thead key={exercise.name + 'a'}>
                            <tr key={exercise.name + 'b'}>
                                <th key={exercise.name + 'c'}> Seria </th>
                                <th key={exercise.name + 'd'}> Powtorzenia </th>
                                <th key={exercise.name + 'e'}> Przerwa </th>
                                <th key={exercise.name + 'g'}> Done </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(exercise.series).keys()].map(serieNo => <tr key={serieNo}>
                                <td> {serieNo + 1} </td>
                                <td> {exercise.repeat} </td>
                                <td> {Math.floor(exercise.przerwa / 60)}:{exercise.przerwa % 60} </td>
                                <td>
                                    <input
                                        value={exercise.przerwa}
                                        type="checkbox"
                                        onChange={handleChange}
                                    ></input></td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>)
            }

            {/* <p /> */}
            <button className='doneButton' onClick={saveTraining}> Done </button>

        </div>
    );
};

export default App;