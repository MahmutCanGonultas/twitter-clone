import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';

const MAX_CHARS = 280;

function TweetForm({ queryKey }) {
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => api.post('/tweets', { content }),
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const charsLeft = MAX_CHARS - content.length;
  const isOverLimit = charsLeft < 0;
  const isEmpty = content.trim().length === 0;

  return (
    <div className="tweet-compose">
      <div className="tweet-avatar">{user?.username?.[0]?.toUpperCase()}</div>
      <div className="tweet-compose-inner">
        <textarea
          placeholder="Neler oluyor?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <div className="tweet-compose-footer">
          <span
            className={`char-count ${charsLeft < 20 ? 'warning' : ''} ${isOverLimit ? 'danger' : ''}`}
          >
            {charsLeft}
          </span>
          <button
            className="btn-tweet"
            onClick={() => mutation.mutate()}
            disabled={isEmpty || isOverLimit || mutation.isPending}
          >
            {mutation.isPending ? 'Gönderiliyor...' : 'Tweetle'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TweetForm;
