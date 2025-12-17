import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { bookService } from '../services/bookService';
import { rentalService } from '../services/rentalService';
import { BackButton } from '../components/layout/BackButton';
import { MainLayout } from '../components/layout/MainLayout';

const PAGE_SIZE = 8;

type EditMode = {
  isEditing: boolean;
  bookId: string | null;
};

export const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [renting, setRenting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState<EditMode>({
    isEditing: false,
    bookId: null,
  });

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    genre: '',
    publishedYear: '',
    totalCopies: '',
  });

  const { user } = useContext(AuthContext) || {};

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      description: '',
      genre: '',
      publishedYear: '',
      totalCopies: '',
    });
    setEditMode({ isEditing: false, bookId: null });
  };

  const handleRent = async (bookId: string) => {
    try {
      setRenting(bookId);
      const userId = (user as any)?.id;
      await rentalService.rentBook(bookId, userId);
      alert('Book rented successfully! Due in 14 days.');
      fetchBooks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to rent book');
    } finally {
      setRenting(null);
    }
  };

  const handleEditBook = (book: any) => {
    setShowForm(true);
    setEditMode({ isEditing: true, bookId: book._id });
    setFormData({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      description: book.description || '',
      genre: book.genre || '',
      publishedYear: String(book.publishedYear || ''),
      totalCopies: String(book.totalCopies || ''),
    });
  };

  const handleDeleteBook = async (id: string) => {
    if (
      !window.confirm(
        'Delete this book? This action cannot be undone and will remove it from the catalog.'
      )
    ) {
      return;
    }

    try {
      await bookService.deleteBook(id);
      alert('Book deleted successfully');
      fetchBooks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode.isEditing && editMode.bookId) {
        await bookService.updateBook(editMode.bookId, {
          title: formData.title,
          author: formData.author,
          isbn: formData.isbn,
          description: formData.description,
          genre: formData.genre,
          publishedYear: Number(formData.publishedYear),
          totalCopies: Number(formData.totalCopies),
        });
        alert('Book updated successfully');
      } else {
        await bookService.createBook({
          title: formData.title,
          author: formData.author,
          isbn: formData.isbn,
          description: formData.description,
          genre: formData.genre,
          publishedYear: Number(formData.publishedYear),
          totalCopies: Number(formData.totalCopies),
        });
        alert('Book created successfully');
      }

      resetForm();
      setShowForm(false);
      fetchBooks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save book');
    }
  };

  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentBooks = books.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  if (loading) {
    return (
      <MainLayout title="Books">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading books...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Books">
      <BackButton to="/dashboard" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Available books</h2>
        {user?.role === 'admin' && (
          <button
            onClick={() => {
              if (showForm && editMode.isEditing) {
                resetForm();
              }
              setShowForm(!showForm);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
          >
            {showForm ? 'Cancel' : '+ Add Book'}
          </button>
        )}
      </div>

      {showForm && user?.role === 'admin' && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 mb-6">
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            {editMode.isEditing ? 'Edit book' : 'Create new book'}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Genre</label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Published year
              </label>
              <input
                type="number"
                value={formData.publishedYear}
                onChange={(e) =>
                  setFormData({ ...formData, publishedYear: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Total copies
              </label>
              <input
                type="number"
                min={1}
                value={formData.totalCopies}
                onChange={(e) =>
                  setFormData({ ...formData, totalCopies: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex justify-end space-x-2">
              {editMode.isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg text-sm"
              >
                {editMode.isEditing ? 'Update book' : 'Save book'}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {books.length === 0 ? (
        <div className="text-center text-gray-500 py-10 text-sm">
          No books available.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentBooks.map((book) => (
              <div
                key={book._id}
                className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Author:</span> {book.author}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Genre:</span> {book.genre}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Published:</span>{' '}
                    {book.publishedYear}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">ISBN:</span> {book.isbn}
                  </p>
                  {book.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-3">
                      {book.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span
                    className={`text-sm font-semibold ${
                      book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {book.availableCopies > 0
                      ? `${book.availableCopies} available`
                      : 'Not available'}
                  </span>

                  <div className="flex items-center space-x-2">
                    {book.availableCopies > 0 && user?.role === 'customer' && (
                      <button
                        onClick={() => handleRent(book._id)}
                        disabled={renting === book._id}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-xs py-2 px-3 rounded-lg"
                      >
                        {renting === book._id ? 'Renting...' : 'Rent book'}
                      </button>
                    )}

                    {user?.role === 'admin' && (
                      <>
                        <button
                          onClick={() => handleEditBook(book)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs py-2 px-3 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2 px-3 rounded-lg"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm text-gray-700">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="space-x-2">
                <button
                  onClick={goToPrev}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};
