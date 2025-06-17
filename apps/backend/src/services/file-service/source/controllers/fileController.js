//  This code controls all our file access on the backend

const File = require('../models/fileModel');
const cache = require('../cache');

exports.getAll = async (req, res) => {  //  get all files (might nuke this one tbh)
  const files = await File.getAllFiles();
  res.json(files);
};


exports.getByName = async (req, res) => {
  const filename = req.params.filename;
  const cached = await cache.get(`file:name:${filename}`);
  if (cached) return res.json(JSON.parse(cached));

  const file = await File.getFileByName(filename);
  if (!file) return res.status(404).send("File not found");

  await cache.set(`file:name:${filename}`, JSON.stringify(file), { EX: 3600 });
  res.json(file);
};


exports.getById = async (req, res) => {  //  get file by ID
  const id = req.params.id;
  const cached = await cache.get(`file:${id}`);
  if (cached) return res.json(JSON.parse(cached));

  const file = await File.getFileById(id);
  if (!file) return res.status(404).send("Not found");

  await cache.set(`file:${id}`, JSON.stringify(file), { EX: 3600 });
  res.json(file);
};


exports.upload = async (req, res) => {  //  upload file
  //  assume file upload already handled by middleware
  const { filename, mimetype, location: url } = req.file;
  const metadata = await File.insertFile({
    filename,
    mime_type: mimetype,
    url,
    uploaded_by: req.body.uploaded_by, //  you get this from token in real usage
  });

  res.status(201).json(metadata);
};

exports.remove = async (req, res) => {  //  delete file
  await File.deleteFile(req.params.id);
  res.sendStatus(204);
};
