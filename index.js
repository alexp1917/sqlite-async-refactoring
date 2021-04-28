function LabelRepository(db) {
  this.db = db;
}

LabelRepository.prototype.getAll = async function() {
  return new Promise((res, rej) => {
    this.db.all("select * from labels", (e, d) => e ? rej(e) : res(d));
  });
};

LabelRepository.prototype.insert = function(label) {
  return new Promise((res, rej) => {
    var p = [
      label.name,
      label.value,
    ];
    var q = "INSERT into labels (name, value) values(?,?)";
    this.db.run(q, p, e => e ? rej() : res());
  })
};

LabelRepository.prototype.updateOneById = async function(id, label) {
  return new Promise((res, rej) => {
    var p = [
      label.name,
      label.value,
      id,
    ];
    var q = 'UPDATE labels set name = ?, value = ? where id = ?';
    this.db.run(q, p, e => e ? rej() : res());
  });
};

var labels = new LabelRepository(db);

route.get('/labels', async (req, res) => {
  try {
    var rows = await labels.getAll();
    res.json({
      error: false,
      data: rows,
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

route.post('/label', async (req, res) => {
  try {
    await labels.insert(req.body);
    res.status(201).json({
      error: false,
      data: "label successfully added",
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

route.patch('/label/:id', async (req, res) => {
  try {
    await labels.updateOneById(req.params.id, req.body);
    res.status(201).json({
      error: false,
      data: "label successfully added",
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});
