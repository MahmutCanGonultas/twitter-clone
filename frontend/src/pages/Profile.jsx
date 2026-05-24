import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import Layout from '../components/Layout';
import TweetCard from '../components/TweetCard';

function Profile() {
  const { username } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profileKey = ['profile', username];
  const tweetsKey = ['userTweets', username];
  const followKey = ['followStatus', username];

  const { data: profileData } = useQuery({
    queryKey: profileKey,
    queryFn: () => api.get(`/users/${username}`).then((r) => r.data.user),
  });

  const { data: tweets, isLoading } = useQuery({
    queryKey: tweetsKey,
    queryFn: () =>
      api.get(`/users/${username}/tweets`).then((r) => r.data.tweets),
  });

  const { data: isFollowing } = useQuery({
    queryKey: followKey,
    queryFn: () =>
      api
        .get(`/users/${profileData.id}/follow-status`)
        .then((r) => r.data.isFollowing),
    enabled: !!profileData && !!user && user.username !== username,
  });

  const followMutation = useMutation({
    mutationFn: () =>
      isFollowing
        ? api.delete(`/follows/${profileData.id}`)
        : api.post(`/follows/${profileData.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followKey });
    },
  });

  const isOwnProfile = user?.username === username;

  return (
    <Layout>
      <div className="page-header">
        <h2>Profil</h2>
      </div>
      <div className="profile-header">
        <div className="profile-avatar-lg">{username?.[0]?.toUpperCase()}</div>
        <div className="profile-name">{username}</div>
        <div className="profile-handle">@{username}</div>
        {!isOwnProfile && user && profileData && (
          <div className="profile-actions">
            <button
              className={`btn-follow ${isFollowing ? 'following' : ''}`}
              onClick={() => followMutation.mutate()}
              disabled={followMutation.isPending}
            >
              {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
            </button>
          </div>
        )}
      </div>
      <div className="tweet-list">
        {isLoading && <div className="loading">Yükleniyor...</div>}
        {!isLoading && tweets?.length === 0 && (
          <div className="empty-state">
            <h3>Henüz tweet yok</h3>
            <p>@{username} henüz tweet atmadı.</p>
          </div>
        )}
        {tweets?.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} queryKey={tweetsKey} />
        ))}
      </div>
    </Layout>
  );
}

export default Profile;
