//  This code controls all our file access on the backend

const File = require('../models/fileModel');
const cache = require('../cache');

exports.getAll = async (req, res) => {
  const cached = await cache.get('files:all');
  if (cached) return res.json(JSON.parse(cached));

  const files = await File.getAllFiles();
  await cache.set('files:all', JSON.stringify(files), { EX: 3600 });
  res.json(files);
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  const cached = await cache.get(`file:${id}`);
  if (cached) return res.json(JSON.parse(cached));

  const file = await File.getFileById(id);
  if (!file) return res.status(404).send("Not found");

  await cache.set(`file:${id}`, JSON.stringify(file), { EX: 3600 });
  res.json(file);
};

exports.getByName = async (req, res) => {
  const filename = req.params.filename;
  const cached = await cache.get(`file:name:${filename}`);
  if (cached) return res.json(JSON.parse(cached));

  const file = await File.getFileByName(filename);
  if (!file) return res.status(404).send("Not found");

  await cache.set(`file:name:${filename}`, JSON.stringify(file), { EX: 3600 });
  res.json(file);
};

exports.upload = async (req, res) => {
//  validated and sanitized req.body
const { uploaded_by } = req.body;
const { filename, mimetype, location: url } = req.file;

if (!filename || !mimetype || !url || !uploaded_by) {
  return res.status(400).json({ message: "Missing file or metadata fields" });
}

const metadata = await File.insertFile({
  filename,
  mime_type: mimetype,
  url,
  uploaded_by,
});

  // Invalidate cache
  await cache.del('files:all');

  res.status(201).json(metadata);
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const { filename, mime_type, url } = req.body;

  const updated = await File.updateFile(id, { filename, mime_type, url });
  if (!updated) return res.status(404).send("Not found");

  // Invalidate relevant caches
  await Promise.all([
    cache.del('files:all'),
    cache.del(`file:${id}`),
    filename ? cache.del(`file:name:${filename}`) : Promise.resolve(),
  ]);

  res.json(updated);
};

exports.remove = async (req, res) => {
  const id = req.params.id;

  await File.deleteFile(id);

  // Invalidate relevant caches
  await Promise.all([
    cache.del('files:all'),
    cache.del(`file:${id}`),
  ]);

  res.sendStatus(204);
};
