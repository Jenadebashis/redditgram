import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostCard } from '../components/PostCard';
import API from '../api';

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  },
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

const commentsFirst = { results: [ { id: 2, text: 'hey', author_username: 'alice', is_liked: false, like_count: 0 } ] };
const repliesAfter = { results: [ { id: 3, text: 'reply', author_username: 'bob', is_liked: false, like_count: 0 } ] };

test('user can reply to a comment', async () => {
  API.get.mockResolvedValueOnce({ data: commentsFirst });
  API.get.mockResolvedValueOnce({ data: { results: [] } });

  render(<PostCard post={samplePost} />);

  fireEvent.click(screen.getByText(/💬/));
  await screen.findByText('hey');

  fireEvent.click(screen.getByText('Reply'));
  const input = screen.getByPlaceholderText('Add a reply');
  fireEvent.change(input, { target: { value: 'reply' } });

  API.post.mockResolvedValueOnce({});
  API.get.mockResolvedValueOnce({ data: commentsFirst });
  API.get.mockResolvedValueOnce({ data: repliesAfter });

  fireEvent.click(screen.getByText(/^Post$/));

  await waitFor(() => {
    expect(API.post).toHaveBeenCalledWith('/comments/2/replies/', { text: 'reply' });
  });

  expect(await screen.findByText('reply')).toBeInTheDocument();
});
