import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import API from '../services/api';

jest.mock('../services/api', () => ({
  get: jest.fn(),
  delete: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders the Dashboard header and loads notes from API', async () => {
    API.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          title: 'First Test Note',
          content: '<p>Hello world content</p>',
        },
      ],
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/Notely Dashboard/i)).toBeInTheDocument();

    expect(screen.getByText(/Loading your notes/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/First Test Note/i)).toBeInTheDocument();
    });

    expect(API.get).toHaveBeenCalledWith('/notes');
  });

  it('displays message when there are no notes', async () => {
    API.get.mockResolvedValueOnce({
      data: [],
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/You don't have any notes yet/i)
      ).toBeInTheDocument();
    });
  });

  it('displays error message when notes cannot be loaded', async () => {
    API.get.mockRejectedValueOnce(new Error('Failed to fetch notes'));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load notes/i)
      ).toBeInTheDocument();
    });
  });

  it('deletes a note successfully', async () => {
    API.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          title: 'Note To Delete',
          content: '<p>Test content</p>',
        },
      ],
    });

    API.delete.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Note To Delete/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(API.delete).toHaveBeenCalledWith('/notes/1');
    });

    await waitFor(() => {
      expect(
        screen.queryByText(/Note To Delete/i)
      ).not.toBeInTheDocument();
    });
  });

  it('logs out and removes user information from localStorage', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('userName', 'Maira');

    API.get.mockResolvedValueOnce({
      data: [],
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Log Out/i }));

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userName')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('redirects to login when API returns 401', async () => {
    API.get.mockRejectedValueOnce({
      response: {
        status: 401,
      },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load notes/i)
      ).toBeInTheDocument();
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userName')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});