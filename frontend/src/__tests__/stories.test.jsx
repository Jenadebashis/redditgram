import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import StoriesList from '../components/StoriesList';
import CreateStory from '../pages/CreateStory';
import API, { createStory } from '../api';

jest.mock('../api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn(), interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } } },
  createStory: jest.fn(),
  deleteStory: jest.fn(),
}));

const sampleStories = { results: [ { id: 1, file: 'http://x/story.png' } ] };

test('lists stories from API', async () => {
  API.get.mockResolvedValueOnce({ data: sampleStories });
  render(<StoriesList />);
  await waitFor(() => {
    expect(API.get).toHaveBeenCalledWith('/stories/');
  });
  expect(await screen.findByRole('img')).toBeInTheDocument();
});

test('create story submits form data', async () => {
  const file = new File(['hi'], 'a.png', { type: 'image/png' });
  createStory.mockResolvedValue({});

  render(
    <MemoryRouter initialEntries={["/create-story"]}>
      <Routes>
        <Route path="/create-story" element={<CreateStory />} />
      </Routes>
    </MemoryRouter>
  );

  const input = screen.getByLabelText(/file/i);
  fireEvent.change(input, { target: { files: [file] } });

  fireEvent.click(screen.getByRole('button', { name: /create story/i }));

  await waitFor(() => {
    expect(createStory).toHaveBeenCalled();
  });
});
