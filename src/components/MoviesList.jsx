import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Pagination, Modal, Spin, notification } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MovieCard from './MovieCard';
import HeaderBar from './HeaderBar';
import EmptyMovieList from './EmptyMovieList';
import { fetchMovie, deleteMovieById } from '../api/movies';
import Vectors from '../assets/Vectors.png';

const { Content } = Layout;
const { confirm } = Modal;

/**
 * MoviesList Component
 * Displays a grid of movies with pagination and actions like edit and delete
 */
export default function MoviesList() {
  // State Management
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(1);
  const [movieCount, setMovieCount] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Navigation Handlers
  const handleAddMovie = () => navigate('/add-movie');
  const handleEdit = (movie) => navigate(`/edit-movie/${movie.id}`, { state: { movieData: movie } });
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/signin';
  };

  // Utility Functions
  const posterSrc = (url) => (url?.startsWith("http") ? url : `http://127.0.0.1:8000/${url}`);

  // Menu Configuration
  const getMenu = (movie) => ({
    items: [
      {
        key: 'edit',
        label: <span onClick={() => handleEdit(movie)}><EditOutlined /> {t('Edit')}</span>,
      },
      {
        key: 'delete',
        label: <span onClick={() => showDeleteConfirm(movie)}><DeleteOutlined /> {t('Delete')}</span>,
      },
    ],
  });

  // Pagination Configuration
  const itemRender = (page, type, originalElement) => {
    if (type === 'prev') {
      return <button className="custom-nav-btn">{t('Prev')}</button>;
    }
    if (type === 'next') {
      return <button className="custom-nav-btn">{t('Next')}</button>;
    }
    return originalElement;
  };

  // Delete Movie Handlers
  const showDeleteConfirm = (movie) => {
    confirm({
      title: t('Are you sure you want to delete this movie?'),
      icon: <ExclamationCircleOutlined />,
      content: `"${movie.title}" ${t('will be permanently removed.')}`,
      okText: t('Yes'),
      okType: 'danger',
      cancelText: t('No'),
      onOk: () => deleteMovie(movie.id),
    });
  };

  const deleteMovie = async (id) => {
    try {
      setLoading(true);
      await deleteMovieById(id);
      fetchMovies();
      notification.success({
        message: t('Success'),
        description: t('Movie deleted successfully.'),
      });
    } catch (error) {
      notification.error({
        message: t('Error'),
        description: t('Something went wrong while deleting movie.'),
      });
    } finally {
      setLoading(false);
    }
  };

  // Data Fetching
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetchMovie(current);
      setMovies(response.data || []);
      setMovieCount(response.count || 0);
    } catch (error) {
      console.error("Error while fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Side Effects
  useEffect(() => {
    fetchMovies();
  }, [current]);

  // Render Component
  return (
    <Layout style={{ minHeight: '100vh', background: '#093545', color: '#fff' }}>
      <Spin spinning={loading}>
        {movies.length > 0 ? (
          <>
            <HeaderBar t={t} handleAddMovie={handleAddMovie} handleLogout={handleLogout} />
            <Content className="px-6 md:px-12 lg:px-24 xl:px-32">
              {/* Movie Grid */}
              <Row gutter={[24, 24]}>
                {movies.map((movie) => (
                  <Col xs={12} sm={12} md={8} lg={6} key={movie.id}>
                    <MovieCard movie={movie} posterSrc={posterSrc} getMenu={getMenu} />
                  </Col>
                ))}
              </Row>
              {/* Pagination */}
              <div className="custom-pagination-container">
                <Pagination
                  current={current}
                  total={movieCount}
                  pageSize={8}
                  onChange={setCurrent}
                  itemRender={itemRender}
                  showLessItems
                />
              </div>
            </Content>
          </>
        ) : (
          <EmptyMovieList onAddMovie={handleAddMovie} />
        )}
      </Spin>
      {/* Background Image */}
      <img src={Vectors} className={movies.length > 0 ? 'movie-bg-wave' : 'bg-wave'} alt="bg" />
    </Layout>
  );
}
