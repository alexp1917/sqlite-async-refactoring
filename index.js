/**
 * promisify a whole object
 * @param  {sqlite} db the thing being proxied
 * @return {Proxy}     sqlite, but with async methods
 */
function asyncDb(db) {
  var cache = {};
  return new Proxy({
    get(target, prop) {
      if (!cache[prop]) {
        cache[prop] = util.promisify(db[prop]);
      }

      return cache[prop];
    }
  });
}

var db = asyncDb(db);

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

route.get('/labels', async (req, res) => {
  var rows = await db.all("SELECT * FROM labels");
  res.json({
    error: false,
    data: rows,
  });
});

route.post('/label', async (req, res) => {
  var { name, value } = req.body;
  await db.run('INSERT into labels (name, value) values(?,?)',
    [name, value]);
  res.status(201).json({
    error: false,
    data: "label successfully added",
  });
});

route.patch('/label/:id', async (req, res) => {
  var { name, value } = req.body;
  await db.run('UPDATE labels set name = ?, value = ? where id = ?',
    [name, value]);
  res.status(201).json({
    error: false,
    data: "label successfully added",
  });
});
