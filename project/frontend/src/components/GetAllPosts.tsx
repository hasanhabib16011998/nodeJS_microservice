import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import './styles/GetAllPosts.css';
import API_URLS from '../apiEndpoints';

interface Post {
  _id: string;
  user: string;
  content: string;
  mediaIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface PostsResponse {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

function GetAllPosts() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<PostsResponse>(
          `${API_URLS.POST_SERVICE}/all-posts?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
      } catch (err: any) {
        setError('Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) {
      fetchPosts();
    }
  }, [accessToken, page]);

  return (
    <div className="posts-root">
      <div className="posts-container">
        <h2 className="posts-title">All you have to see</h2>
        {loading && <div className="posts-loading">Loading posts...</div>}
        {error && <div className="posts-error">{error}</div>}
        {!loading && !error && (
          <div>
            {posts.length === 0 ? (
              <div className="posts-empty">No posts available.</div>
            ) : (
              <ul className="posts-list">
                {posts.map(post => (
                  <li className="post-item" key={post._id}>
                    <div className="post-header">
                      <span className="post-user">User ID: {post.user}</span>
                      <span className="post-date">
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="post-content">{post.content}</div>
                    {post.mediaIds.length > 0 && (
                      <div className="post-media-ids">
                        <span>Media IDs: {post.mediaIds.join(', ')}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div className="posts-pagination">
              <button
                className="pagination-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GetAllPosts;