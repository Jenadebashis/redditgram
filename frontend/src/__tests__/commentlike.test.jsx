import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostCard } from '../components/PostCard';
import API, { likeComment } from '../api';

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  },
  likeComment: jest.fn(),
}));

const samplePost = {
  id: 1,
  caption: 'sample',
  author_username: 'bob',
  is_liked: false,
  like_count: 0,
  is_bookmarked: false,
  comment_count: 1,
};

const sampleComments = {
  results: [
    { id: 2, text: 'hey', author_username: 'alice', is_liked: false, like_count: 0 },
  ],
};

test('liking a comment updates count', async () => {
  API.get.mockResolvedValueOnce({ data: sampleComments });
  likeComment.mockResolvedValue({ liked: true, like_count: 1 });

  render(<PostCard post={samplePost} />);

  fireEvent.click(screen.getByText(/💬/));

  await screen.findByText('hey');

  const btn = screen.getByText('🤍 0');
  fireEvent.click(btn);

  await waitFor(() => {
    expect(likeComment).toHaveBeenCalledWith(2);
  });

  expect(await screen.findByText('💖 1')).toBeInTheDocument();
});
