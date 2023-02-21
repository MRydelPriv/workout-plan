const HistoryDisplay = ({ historyToDisplay, goBack }) =>
(
    <>
        <table>
            <tbody>{historyToDisplay.map(entry =>
                <tr key={historyToDisplay.indexOf(entry)}>
                    <td key={historyToDisplay.indexOf(entry) + 1}>{entry.date}</td>
                    <td key={historyToDisplay.indexOf(entry) + 2}>{entry.training}</td>
                </tr>)}
            </tbody>
        </table>
        <button onClick={goBack}> Back </button>
    </>
);

export default HistoryDisplay;