import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import API from '../services/api';
import catLogo from '../assets/cat-logo.png';


const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link'],
    ['clean']
  ],
};
  
export default function NoteEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const fetchNote = async () => {
        try {
          const { data } = await API.get('/notes');
          const currentNote = data.find((note) => note._id === id);
          if (currentNote) {
            setTitle(currentNote.title);
            setContent(currentNote.content);
          } else {
            setError('Note not found');
          }
        } catch (err) {
          console.error('Error fetching note details:', err);
          setError('Failed to load note details');
        }
      };
      fetchNote();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const plainText = content.replace(/<[^>]+>/g, '').trim(); // NOSONAR
    
    if (!plainText) {
      setError('Please provide content for your note');
      return;
    }
    try {
      if (isEditing) {
        await API.put(`/notes/${id}`, { title, content });
      } else {
        await API.post('/notes', { title, content });
      }
      navigate('/dashboard'); 
    } catch (err) {
      console.error('Error saving note:', err);
      setError(err.response?.data?.message || 'Failed to save note');
    }
  };

  return (
    
  <div className="min-h-screen bg-purple-100 font-sans">
     <nav className="relative bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
        <img 
          src={catLogo} 
          alt="Notely Cat Logo" 
          className="h-8 w-auto object-contain" 
        />
        <h1 className="text-xl font-bold text-purple-800">Notely</h1>
      </div>
    </nav>

    <div className="max-w-2xl mx-4 sm:mx-auto mt-12 mb-12 bg-white p-8 rounded-lg shadow-lg border-transparent">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Note' : 'Create New Note'}
          </h2>
        </div>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-600 ">Title</label>
            <input 
              id="title"
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="Note title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 bg-purple-50"
            />
          </div>

          <div className="mb-6">
            <div id="content-label" className="block mb-2 text-sm font-medium text-gray-600">Content</div>
            <div className=" rounded-md border border-gray-300 focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600 overflow-hidden bg-purple-50">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={modules}
                placeholder="Write your note content here..."
                className="h-64 mb-12"
              >
              <div aria-labelledby="content-label" />
             </ReactQuill>
            </div>
          </div>
            
          <div className="flex justify-end gap-4">
            <Link 
              to="/dashboard"
              className="px-4 py-2 bg-gray-100 text-gray-500 hover:text-gray-700 font-medium rounded-md transition duration-200"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-md transition duration-200"
            >
              {isEditing ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}