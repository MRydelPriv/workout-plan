import './App.css';
import { useState, useRef, useEffect } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import api from './services/api';
import Notification from './components/Notification';
import HistoryDisplay from './components/HistoryDisplay';
import TrainingDisplay from './components/TrainingDisplay';

const App = () => {
  const clockRef = useRef();
  const [trainings, setTrainigs] = useState([]);
  const [historyToDisplay, setHistoryToDisplay] = useState(null);
  const [counter, setCounter] = useState();
  const [timer, toggleTimer] = useState(false);
  const [currentTraining, setCurrentTraining] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState(null);


  useEffect(() => {
    api
      .getAll('trainings')
      .then(initialTrainings => {
        setTrainigs(initialTrainings);
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

  const updateTraining = () => {
    const repeatsAdded = trainings[currentTraining].excercises
      .filter(exercise => exercise.exId < 6)
      .map(excercise => excercise = { ...excercise, repeat: excercise.repeat + 2 });
    const seriesAdded = repeatsAdded
      .filter(excercise => excercise.repeat > 20)
      .map(excercise => excercise = { ...excercise, series: excercise.series + 1, repeat: 15 });
    const nonRepeated = repeatsAdded
      .filter(excercise => !(seriesAdded
        .map(ex => ex.exId)
        .includes(excercise.exId)));
    const updatedTraining = [...nonRepeated, ...seriesAdded];
    updatedTraining.map(excercise => {
      return api.updateTraining(currentTraining, excercise.exId, excercise);
    });
  };

  const saveTraining = (e) => {
    const date = new Date();
    const parsedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    const trainingNo = Number(currentTraining) + 1;
    api.createHistoryEntry({ date: parsedDate, training: `Training ${trainingNo}` });
    updateTraining();

    setInfoMessage(
      `Training ${trainingNo} was successfully saved`
    );
    setTimeout(() => {
      setInfoMessage(null);
    }, 5000);
  };

  const historyClick = () => {
    api.getAll('history').then((gotHistory) => {
      setHistoryToDisplay(gotHistory);
    });
    setTrainigs(null);
    toggleTimer(false);
  };

  const goBackAction = () => {
    setHistoryToDisplay(null);
    api
      .getAll('trainings')
      .then(initialTrainings => {
        setTrainigs(initialTrainings);
        setLoading(false);
      });
  };

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div>
      <Notification message={infoMessage} type='info' />
      {historyToDisplay
        ? <HistoryDisplay
          historyToDisplay={historyToDisplay}
          goBack={goBackAction}
        />
        : null}
      {trainings
        ? trainings.map(training => <button value={training.id} onClick={handleClick} key={training.id}> Training {training.id + 1} </button>)
        : null}
      {trainings ? <button onClick={historyClick}> History </button> : null}
      {timer
        ? <Countdown
          date={counter}
          renderer={renderer}
          ref={clockRef}
        />
        : null}
      {!historyToDisplay ? <h2> Training {parseInt(currentTraining) + 1}</h2> : null}
      {trainings
        ? trainings[currentTraining].excercises.map(exercise =>
          <TrainingDisplay key={exercise.exId} exercise={exercise} handleChange={handleChange} />)
        : null
      }
      {trainings ? <button onClick={saveTraining}> Done </button> : null}
      <p /> <p />
    </div >
  );
};

export default App;