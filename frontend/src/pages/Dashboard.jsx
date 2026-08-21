import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import DOMPurify from 'dompurify';
import catLogo from '../assets/cat-logo.png';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [userName] = useState(localStorage.getItem('userName') || '');
  
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await API.get('/notes');
        setNotes(data);
        setLoading(false);
      } 
      catch (err) {
        setError('Failed to load notes. Please try logging in again.');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          navigate('/login');
        }
      }
    };
    fetchNotes();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`);  // NOSONAR
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-purple-100 font-sans">
      
<nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
    <img 
      src={catLogo} 
      alt="Notely Cat Logo" 
      className="h-8 w-auto object-contain" 
    />
    <h1 className="text-xl font-bold text-purple-800">Notely</h1>
  </div>
    <p className="hidden md:block absolute left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">
  Hi, {userName} 
</p>
    <div className="flex items-center">
    <button 
      type="button"
      onClick={handleLogout}
      className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md text-sm font-medium hover:border-purple-700 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200"
    >
      Log out
    </button>
  </div>
  
</nav>

      <main className="max-w-6xl mx-auto p-6 mt-4">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Your Notes</h2>
          <Link 
            to="/notes/new" 
            className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium rounded-md shadow-sm transition duration-200"
          >
            + Create Note
          </Link>
        </div>

        {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-md">{error}</p>}
        {loading && <p className="text-gray-500 font-medium">Loading your notes...</p>}

        {!loading && notes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300 mt-8">
            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📝
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No notes found</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">You don't have any notes yet. Create your first note to get started!</p>
          </div>
        ) : (
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div 
                key={note._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-purple-400 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{note.title}</h3>
                  <p className="text-xs text-purple-400 font-medium mb-3">
                    {new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric'
                    })}
                 </p>

                <div className="text-gray-600 text-sm mb-2 line-clamp-4 prose prose-sm" 
                   dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content) }} 
                />
           </div>
                
                <div className="flex justify-end items-center px-6 py-4 bg-gray-50 border-t border-gray-100 gap-4">
                  <button 
                    type="button"
                    onClick={() => handleDelete(note._id)}
                    className="text-sm font-medium text-gray-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  <Link 
                    to={`/notes/edit/${note._id}`} 
                    className="text-sm font-medium text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}