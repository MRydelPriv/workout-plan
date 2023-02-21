import { useState, useRef, useEffect } from 'react';
import './App.css';
import Countdown, { zeroPad } from 'react-countdown';
import history from './services/history';
import trainingsService from './services/trainingsService';
import Notification from './components/Notification';

const App = () => {
    const [trainings, setTrainigs] = useState([]);
    const [historyToDisplay, setHistoryToDisplay] = useState([]);
    const [counter, setCounter] = useState();
    const [timer, toggleTimer] = useState(false);
    const clockRef = useRef();
    const [currentTraining, setCurrentTraining] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [infoMessage, setInfoMessage] = useState(null);


    useEffect(() => {
        trainingsService
            .getAll()
            .then(initialPersons => {
                setTrainigs(initialPersons);
                setLoading(false);
            });
    }, []);


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
    };

    const saveTraining = (e) => {
        const date = new Date();
        const parsedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        const trainingNo = Number(currentTraining) + 1;
        history.create({ date: parsedDate, training: `Training ${trainingNo}` });
        setInfoMessage(
            `Training ${trainingNo} was successfully saved`
        );
        setTimeout(() => {
            setInfoMessage(null);
        }, 5000);
    };

    const historyClick = () => {
        history.getAll().then((gotHistory) => {
            setHistoryToDisplay(gotHistory);
        });
        setTrainigs(null);
        toggleTimer(false);
    };

    if (isLoading) {
        return <div className="App">Loading...</div>;
    }

    return (
        <div>
            <Notification message={infoMessage} type='info' />
            {historyToDisplay
                ? <table>
                    <tbody>{historyToDisplay.map(entry =>
                        <tr key={historyToDisplay.indexOf(entry)}>
                            <td key={historyToDisplay.indexOf(entry) + 1}>{entry.date}</td>
                            <td key={historyToDisplay.indexOf(entry) + 2}>{entry.training}</td>
                        </tr>)}
                    </tbody>
                </table>
                : null}
            {trainings
                ? trainings.map(training => <button value={trainings.indexOf(training)} onClick={handleClick} key={trainings.indexOf(training)}> Training {trainings.indexOf(training) + 1} </button>)
                : null}
            {trainings ? <button onClick={historyClick}> History </button> : null}
            {timer
                ? <Countdown
                    date={counter}
                    renderer={renderer}
                    ref={clockRef}
                />
                : null}
            {trainings
                ? trainings[currentTraining].map(exercise => <div key={exercise.name + 'h'}>
                    <h3 key={exercise.name}> {exercise.name} </h3>
                    <table key={exercise.name + 'f'}>
                        <thead key={exercise.name + 'a'}>
                            <tr key={exercise.name + 'b'}>
                                <th key={exercise.name + 'c'}> Serie </th>
                                <th key={exercise.name + 'd'}> Repeats </th>
                                <th key={exercise.name + 'e'}> Rest </th>
                                <th key={exercise.name + 'g'}> Done </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(exercise.series).keys()].map(serieNo => <tr key={serieNo}>
                                <td> {serieNo + 1} </td>
                                <td> {exercise.repeat} </td>
                                <td> {Math.floor(exercise.rest / 60)}:{exercise.rest % 60} </td>
                                <td>
                                    <input
                                        value={exercise.rest}
                                        type="checkbox"
                                        onChange={handleChange}
                                    ></input></td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>)
                : null
            }
            {trainings ? <button onClick={saveTraining}> Done </button> : null}
            <p /> <p />
        </div >
    );
};

export default App;