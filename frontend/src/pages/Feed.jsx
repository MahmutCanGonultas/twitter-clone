import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import Layout from '../components/Layout';
import TweetForm from '../components/TweetForm';
import TweetCard from '../components/TweetCard';

const QUERY_KEY = ['tweets'];

function Feed() {
  const { user } = useAuth();
  const {
    data: tweets,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => api.get('/tweets').then((r) => r.data.tweets),
  });

  return (
    <Layout>
      <div className="page-header">
        <h2>Ana Sayfa</h2>
      </div>
      {user && <TweetForm queryKey={QUERY_KEY} />}
      <div className="tweet-list">
        {isLoading && <div className="loading">Yükleniyor...</div>}
        {isError && (
          <div className="loading error-msg">Hata: {error.message}</div>
        )}
        {!isLoading && tweets?.length === 0 && (
          <div className="empty-state">
            <h3>Henüz tweet yok</h3>
            <p>İlk tweeti sen at!</p>
          </div>
        )}
        {tweets?.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} queryKey={QUERY_KEY} />
        ))}
      </div>
    </Layout>
  );
}

export default Feed;
