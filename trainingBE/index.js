const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

let history = [];

let trainings = [
    {
        id: 0,
        excercises: [
            { exId: 0, name: 'Dead lift 25kg', series: 3, repeat: 12, rest: 60 },
            { exId: 1, name: 'Hip thrust 25kg', series: 3, repeat: 15, rest: 60 },
            { exId: 2, name: 'Biceps curl with miniband', series: 3, repeat: 12, rest: 45 },
            { exId: 3, name: 'Single arm triceps extension with miniband', series: 3, repeat: 12, rest: 45 },
            { exId: 4, name: 'Unoszenie hantli bokiem', series: 3, repeat: 15, rest: 45 },
            { exId: 5, name: 'Crunches', series: 4, repeat: 15, rest: 60 },
            { exId: 6, name: 'Plank', series: 1, repeat: 1, rest: 60 }
        ]
    },
    {
        id: 1,
        excercises: [
            { exId: 0, name: 'Miniband back pull down', series: 3, repeat: 15, rest: 60 },
            { exId: 1, name: 'Squads', series: 4, repeat: 15, rest: 45 },
            { exId: 2, name: 'Kneeling biceps curl with miniband', series: 3, repeat: 12, rest: 45 },
            { exId: 3, name: 'Reverse pushups', series: 3, repeat: 12, rest: 60 },
            { exId: 4, name: 'Wyciskanie hantli stojąc', series: 3, repeat: 12, rest: 60 },
            { exId: 5, name: 'Standing oblique crunches', series: 4, repeat: 15, rest: 30 },
            { exId: 6, name: 'Plank', series: 1, repeat: 1, rest: 60 }
        ]
    },
    {
        id: 2,
        excercises: [
            { exId: 0, name: 'Miniband single arm row', series: 3, repeat: 15, rest: 45 },
            { exId: 1, name: 'Glute bridge', series: 3, repeat: 15, rest: 45 },
            { exId: 2, name: 'Uginanie przedramion z supinacją', series: 3, repeat: 12, rest: 60 },
            { exId: 3, name: 'Uginanie przedramion', series: 3, repeat: 15, rest: 45 },
            { exId: 4, name: 'Kettlebell high pulls', series: 3, repeat: 15, rest: 60 },
            { exId: 5, name: 'Rowerek', series: 4, repeat: 15, rest: 60 },
            { exId: 6, name: 'Plank', series: 1, repeat: 1, rest: 60 }
        ]
    }
];

app.get('/api/trainings/:id', (request, response) => {
    const id = Number(request.params.id);
    const training = trainings.find(training => training.id === id);

    if (training) {
        response.json(training);
    } else {
        response.status(404).end();
    }
});

app.get('/api/trainings/:id/:exId', (request, response) => {
    const id = Number(request.params.id);
    const exId = Number(request.params.exId);
    const training = trainings.find(training => training.id === id);
    const excercise = training.excercises.find(excercise => excercise.exId === exId);

    if (excercise) {
        response.json(excercise);
    } else {
        response.status(404).end();
    }
});

app.get('/api/history/', (request, response) => {
    response.json(history);
});

app.get('/api/trainings/', (request, response) => {
    response.json(trainings);
});

const generateId = () => {
    const maxId = history.length > 0
        ? Math.max(...history.map(n => n.id))
        : 0;
    return maxId + 1;
};

app.post('/api/history', (request, response) => {
    const body = request.body;

    const hist = {
        id: generateId(),
        date: body.date,
        training: body.training
    };

    history = history.concat(hist);

    response.json(hist);
});

app.patch('/api/trainings/:id/:exId', (req, res) => {
    const training = trainings.find(training => training.id === parseInt(req.params.id));
    if (!training) return res.status(404).json({ message: 'Not Found' });
    const excercise = training.excercises.find(excercise => excercise.exId === parseInt(req.params.exId));
    if (!excercise) return res.status(404).json({ message: 'Not Found' });

    excercise.name = req.body.name;
    excercise.series = req.body.series;
    excercise.repeat = req.body.repeat;
    excercise.rest = req.body.rest;

    res.json(excercise);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

