const TrainingDisplay = ({ exercise, handleChange }) =>
(
    <div key={exercise.exId + 'h'}>
        <h3 key={exercise.id}> {exercise.name} </h3>
        <table key={exercise.exId + 'f'}>
            <thead key={exercise.exId + 'a'}>
                <tr key={exercise.exId + 'b'}>
                    <th key={exercise.exId + 'c'}> Serie </th>
                    <th key={exercise.exId + 'd'}> Repeats </th>
                    <th key={exercise.exId + 'e'}> Rest </th>
                    <th key={exercise.exId + 'g'}> Done </th>
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
    </div>
);

export default TrainingDisplay;