import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PostDetail from '../pages/PostDetail';
import API from '../api';

jest.mock('../api');

const samplePost = { id: 1, caption: 'sample', author_username: 'bob' };

test('renders post detail and fetches data', async () => {
  API.get.mockResolvedValue({ data: samplePost });

  render(
    <MemoryRouter initialEntries={["/posts/1"]}>
      <Routes>
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(API.get).toHaveBeenCalledWith('/posts/1/');
  });

  expect(await screen.findByText(samplePost.caption)).toBeInTheDocument();
});
