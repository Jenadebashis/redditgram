import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostCard } from '../components/PostCard';
import API from '../api';

jest.mock('../api');

const samplePost = {
  id: 1,
  caption: 'sample',
  author_username: 'bob',
  created_at: new Date().toISOString(),
  is_liked: false,
  like_count: 0,
  is_bookmarked: false,
  bookmark_id: null,
  comment_count: 1,
};

const commentsWithReplies = {
  results: [
    {
      id: 10,
      author_username: 'alice',
      text: 'hello',
      replies: [
        { id: 11, author_username: 'john', text: 'hi' },
      ],
    },
  ],
};

test('reply workflow', async () => {
  API.get.mockResolvedValueOnce({ data: commentsWithReplies });

  render(<PostCard post={samplePost} />);

  fireEvent.click(screen.getByText('💬 1'));

  await waitFor(() => {
    expect(API.get).toHaveBeenCalledWith('/posts/1/comments/?include_replies=true');
  });

  expect(await screen.findByText('hello')).toBeInTheDocument();
  expect(screen.getByText('hi')).toBeInTheDocument();

  API.post.mockResolvedValueOnce({});
  API.get.mockResolvedValueOnce({ data: commentsWithReplies });

  fireEvent.click(screen.getByText('Reply'));
  fireEvent.change(screen.getByPlaceholderText('Add a reply'), {
    target: { value: 'new reply' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Reply' }));

  await waitFor(() => {
    expect(API.post).toHaveBeenCalledWith('/comments/10/replies/', { text: 'new reply' });
  });
});
