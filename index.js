route.get('/labels', (req, res) => {
  db.all("SELECT * FROM labels", (err, rows) => {
    if (err) throw err;
    res.json({
      error: false,
      data: rows,
    });
  });
});

route.post('/label', (req, res) => {
  var { name, value } = req.body;
  db.run('INSERT into labels (name, value) values(?,?)',
    [name, value],
    function (err) {
      if (err) throw err;
      res.status(201).json({
        error: false,
        data: "label successfully added",
      });
    }
  );
});

route.patch('/label/:id', (req, res) => {
  var { name, value } = req.body;
  db.run('UPDATE labels set name = ?, value = ? where id = ?',
    [name, value],
    function (err) {
      if (err) throw err;
      res.status(201).json({
        error: false,
        data: "label successfully added",
      });
    }
  );
});
