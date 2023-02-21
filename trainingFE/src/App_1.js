import { useState, useRef } from 'react';
import Countdown, { zeroPad } from 'react-countdown';

const App = () => {
    const trainings1 = [{ name: 'ex rtghnyj 1', series: 3, repeat: 15, przerwa: 45 },
    { name: 'ex derrbn  2', series: 3, repeat: 12, przerwa: 50 },
    { name: 'ex   rth thr3', series: 4, repeat: 8, przerwa: 60 },
    ];
    const [counter, setCounter] = useState(Date.now() + 10);
    const [timer, toggleTimer] = useState(false);
    const clockRef = useRef();

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

    return (
        <div>
            <h1> training 1 </h1>
            {timer
                ? <Countdown
                    date={counter}
                    renderer={renderer}
                    ref={clockRef}
                />
                : null}
            {
                trainings1.map(exercise => <div key={exercise.name + 'h'}>
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
        </div>
    );
};

export default App;