import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'az önce';
  if (diffMins < 60) return `${diffMins}d`;
  if (diffHours < 24) return `${diffHours}s`;
  if (diffDays < 7) return `${diffDays}g`;
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

const HeartIcon = ({ filled }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

function TweetCard({ tweet, queryKey }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () =>
      tweet.is_liked
        ? api.delete(`/likes/${tweet.id}`)
        : api.post(`/likes/${tweet.id}`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old.map((t) =>
          t.id === tweet.id
            ? {
                ...t,
                is_liked: !t.is_liked,
                like_count: t.is_liked ? t.like_count - 1 : t.like_count + 1,
              }
            : t,
        ),
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      queryClient.setQueryData(queryKey, ctx.prev);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/tweets/${tweet.id}`),
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (old) =>
        old.filter((t) => t.id !== tweet.id),
      );
    },
  });

  const isOwner = user?.id === Number(tweet.user_id);

  return (
    <article className="tweet-card">
      <Link to={`/profile/${tweet.username}`} className="tweet-avatar-link">
        <div className="tweet-avatar">{tweet.username?.[0]?.toUpperCase()}</div>
      </Link>
      <div className="tweet-body">
        <div className="tweet-header">
          <Link to={`/profile/${tweet.username}`} className="tweet-username">
            {tweet.username}
          </Link>
          <span className="tweet-handle">@{tweet.username}</span>
          <span className="tweet-time">{formatTime(tweet.created_at)}</span>
        </div>
        <p className="tweet-content">{tweet.content}</p>
        <div className="tweet-actions">
          {user ? (
            <button
              className={`action-btn ${tweet.is_liked ? 'liked' : ''}`}
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
            >
              <HeartIcon filled={tweet.is_liked} />
              <span>{tweet.like_count}</span>
            </button>
          ) : (
            <span className="like-static">
              <HeartIcon filled={false} />
              {tweet.like_count}
            </span>
          )}
          {isOwner && (
            <button
              className="action-btn delete-btn"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default TweetCard;
