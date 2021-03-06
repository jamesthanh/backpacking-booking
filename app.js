const express = require('express');
const fs = require('fs');

const app = express();

// middleware to use req.body
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// get all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// get tour by id
// get all tours
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
  // JS trick to cover a string-like number to a number
  const id = req.params.id * 1;
  const tour = tours.find((element) => element.id === id);
  if (id > tours.length || id < 0 || !Number.isInteger(id)) {
    return res.status(401).json({
      status: 'fail',
      msg: 'No tour found',
    });
  }

  res.status(200).json({
    status: 'success',
    tour,
  });
});

// create a new tour
app.post('/api/v1/tours', (req, res) => {
  //   console.log(req.body);
  // add a mock id for the new tour as there is no database now
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
