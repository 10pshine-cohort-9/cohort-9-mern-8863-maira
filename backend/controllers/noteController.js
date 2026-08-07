import Note from '../models/Note.js';
import logger from '../config/logger.js';

export const getNotes= async(req,res) =>{
try{
const notes = await Note.find({ user: req.user.id });
res.status(200).json(notes);
}
catch(error){
logger.error(`Failed to fetch notes: ${error.message}`);
res.status(500).json({ message: 'Server error' });
}
};

export const createNote= async(req,res) =>{
try{
const { title, content } = req.body;
if (!title || !content) {
logger.warn('Note creation failed: Missing title or content');
return res.status(400).json({ message: 'Please provide both title and content' });
}
const note = await Note.create({
title,
content,
user: req.user.id, });
logger.info(`Note created successfully by user ID: ${req.user.id}`);
res.status(201).json(note);
}
catch(error){
logger.error(`Failed to create note: ${error.message}`);
res.status(500).json({ message: 'Server error' });
}
};

export const updateNote = async (req, res) => {
try {
const updatedNote = await Note.findOneAndUpdate(
{ 
    _id: req.params.id, 
    user: req.user.id 
},
{
$set: {
title: req.body.title,
content: req.body.content,
},},
{ new: true, runValidators: true }
);
if (!updatedNote) {
logger.warn(`Note update failed: Not found or unauthorized (ID: ${req.params.id})`);
return res.status(404).json({ message: 'Note not found or not authorized' });
}
res.status(200).json(updatedNote);
} catch (error) {
if (error.name === 'ValidationError' || error.name === 'CastError') {
logger.warn(`Validation error during update: ${error.message}`);
return res.status(400).json({ message: error.message });}
logger.error(`Failed to update note: ${error.message}`);
res.status(500).json({ message: 'Server error' });
}
};

export const deleteNote= async(req,res) =>{
try{
const note = await Note.findById(req.params.id);
if (!note) {
logger.warn(`Note deletion failed: Note not found (ID: ${req.params.id})`);
return res.status(404).json({ message: 'Note not found' });
}
if (note.user.toString() !== req.user.id) {
logger.warn(`Unauthorized delete attempt on note ${req.params.id} by user ${req.user.id}`);
return res.status(401).json({ message: 'User not authorized to delete this note' });
}
await note.deleteOne();
logger.info(`Note deleted successfully (ID: ${req.params.id})`);
    res.status(200).json({ id: req.params.id, message: 'Note removed' });
}
catch(error){
logger.error(`Failed to delete note: ${error.message}`);
res.status(500).json({ message: 'Server error' });
}
};