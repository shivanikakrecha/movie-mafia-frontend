import React, { useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Typography, Pagination, Button, Modal, Dropdown, Spin, notification, Tooltip } from 'antd';
import { PlusOutlined, LogoutOutlined, EditOutlined, DeleteOutlined, MoreOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Vectors from '../assets/Vectors.png';
import { deleteMovieById, fetchMovie } from '../api/movies';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const API_URL = import.meta.env.VITE_API_URL;
const { Header, Content } = Layout;
const { Title, Text } = Typography;

const { confirm } = Modal;

export default function MyMoviesPage() {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(1);
  const [movieCount, setMovieCount] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const posterSrc = (url) => {
    const isExternal = url?.startsWith("http");
    const posterUrl = isExternal
      ? url
      : `http://127.0.0.1:8000/${url}`;
    return posterUrl;
  }

  const showDeleteConfirm = (movie) => {
    console.log("Delete Confirm Popup triggered!");
    confirm({
      title: t('Are you sure you want to delete this movie?'),
      icon: <ExclamationCircleOutlined />,
      content: `"${movie.title}" ${t('will be permanently removed.')}`,
      okText: t('Yes'),
      okType: 'danger',
      cancelText: t('No'),
      onOk() {
        deleteMovie(movie.id);
        notification.success({
          message: t('Success'),
          description: t('Movie') + movie.title + t('deleted') + '.'
        });
      },
      onCancel() {
        console.log('Delete cancelled');
      },
    });
  };

  const onChange = (page) => {

    setCurrent(page);
  };

  const getMenu = (movie) => ({
    items: [
      {
        key: 'edit',
        label: (
          <span onClick={() => handleEdit(movie)}>
            <EditOutlined /> Edit
          </span>
        ),
      },
      {
        key: 'delete',
        label: (
          <span onClick={() => showDeleteConfirm(movie)}>
            <DeleteOutlined /> Delete
          </span>
        ),
      },
    ],
  });

  const getNavMenu = () => ({
    items: [
      {
        key: 'language',
        label: (
          <LanguageSelector />
        ),
      },
      {
        key: 'logout',
        label: (
          <Button
            type="link"
            onClick={handleLogout}
            icon={<LogoutOutlined />}
            style={{ color: 'black'}}
            className="self-start md:self-auto"
          >
            {t('Logout')}
          </Button>
        ),
      },
    ],
  });


  const itemRender = (page, type, originalElement) => {
    if (type === 'prev') {
      return <button className="custom-nav-btn">Prev</button>;
    }
    if (type === 'next') {
      return <button className="custom-nav-btn">Next</button>;
    }
    return originalElement;
  };

  const handleAddMovie = () => {
    navigate('/add-movie');
  };

  const handleEdit = (movie) => {
    navigate(`/edit-movie/${movie.id}`, { state: { movieData: movie } });
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetchMovie(current);

      if (!response || !response.data) {
        console.error("Error: No data received while fetching movies.");
        return;
      }
      console.log("Fetched Movie: ", response);
      setMovieCount(response?.count);
      setMovies(response.data);
    } catch (error) {
      console.error("Error while fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (id) => {
    try {
      setLoading(true);
      const response = await deleteMovieById(id);
      fetchMovies();
    } catch (error) {
      notification.error({
        message: t('Error'),
        description: t('Something went wrong while deleting movie.')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [current]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/signin';
  };

  return (
    <>
      <Layout style={{ minHeight: '100vh', background: '#093545', color: '#fff' }}>
        <Spin spinning={loading} size='large'>
          {
            movies.length > 0 ?
              <>
                <Header className="bg-transparent !px-6 sm:!px-6 md:!px-12 lg:!px-24 xl:!px-32 flex flex-row items-start md:items-center justify-between gap-4">
                  <Title
                    level={3}
                    className="!text-white !m-0 flex items-center text-lg sm:text-xl md:text-2xl"
                  >
                    {t('My movies')}&nbsp;
                    <Tooltip title="Add new movie">
                      <Button
                        className="!bg-transparent !text-white !border-white !border-2"
                        size="small"
                        shape="circle"
                        onClick={handleAddMovie}
                        icon={<PlusOutlined />}
                      />
                    </Tooltip>
                  </Title>

                  <Dropdown menu={getNavMenu()} trigger={['hover']} placement="bottomLeft">
                    <MoreOutlined
                      style={{
                        position: 'absolute',
                        top: 30,
                        right: 30,
                        // fontSize: '20px',
                        color: '#fff',
                        zIndex: 2,
                        background: '#1d4c5c',
                        borderRadius: '20%',
                        padding: '6px',
                        cursor: 'pointer',
                      }}
                      className='sm:p-1 md:p-2 sm:text-sm md:text-lg'
                    />
                  </Dropdown>
                </Header>

                <Content className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32">
                  <Row gutter={[24, 24]}>
                    {movies.map((movie, index) => (
                      <Col xs={12} sm={12} md={8} lg={6} key={index}>
                        <div style={{ position: 'relative' }} className="glossy-hover-col">
                          {/* Three Dots Dropdown */}
                          <Dropdown menu={getMenu(movie)} trigger={['hover']} placement="bottomRight">
                            <MoreOutlined
                              style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                // fontSize: '20px',
                                color: '#fff',
                                zIndex: 2,
                                background: '#093545',
                                border: '2px solid rgb(80, 205, 251)',
                                borderRadius: '20%',
                                padding: '6px',
                                cursor: 'pointer',
                              }}
                              className='sm:p-1 md:p-2 sm:text-sm md:text-lg'
                            />
                          </Dropdown>

                          <Card
                            hoverable
                            cover={
                              <img
                                alt={movie.title}
                                src={posterSrc(movie.poster_url)}
                                // style={{ height: '400px', objectFit: 'fit' }}
                                className="h-60 sm:h-72 md:h-80 lg:h-96 object-cover w-full"
                              />
                            }
                            bodyStyle={{ padding: 0 }}
                            style={{ borderRadius: '10px', overflow: 'hidden', background: '#092C39' }}
                          >
                            {/* <Text strong style={{ fontFamily: 'Monsterrat', fontWeight: 500, fontSize: 20, color: '#FFFFFF' }}>
                              {movie.title}
                            </Text>
                            <br />
                            <Text type="secondary" style={{ fontFamily: 'Monsterrat', fontWeight: 400, fontSize: 14, color: '#FFFFFF' }}>
                              {movie.year}
                            </Text> */}
                            <div className="p-3 sm:p-4 md:p-5 sm:text-sm md:text-xl">
                              <Text
                                strong
                                style={{
                                  fontFamily: 'Montserrat',
                                  fontWeight: 500,
                                  // fontSize: 20,
                                  color: '#FFFFFF',
                                }}
                              >
                                {movie.title}
                              </Text>
                              <br />
                              <Text
                                type="secondary"
                                className='sm:text-xs md:text-sm'
                                style={{
                                  fontFamily: 'Montserrat',
                                  fontWeight: 400,
                                  // fontSize: 14,
                                  color: '#FFFFFF',
                                }}
                              >
                                {movie.year}
                              </Text>
                            </div>
                          </Card>
                        </div>
                      </Col>
                    ))}
                  </Row>

                  <div className="custom-pagination-container">
                    <Pagination
                      current={current}
                      total={movieCount}
                      pageSize={8}
                      onChange={onChange}
                      itemRender={itemRender}
                      showLessItems={true}
                    />
                  </div>
                </Content>
              </> :
              <>
                <div className='empty-movielist-container'>
                  <h2 className='empty-movielist-title'>
                    Your movie list is empty
                  </h2>
                  <button className='add-new-movie' onClick={handleAddMovie}>
                    Add New Movie
                  </button>
                </div>
              </>
          }
        </Spin>
        <img src={Vectors} className={movies.length > 0 ? 'movie-bg-wave' : 'bg-wave'}></img>
      </Layout>
    </>
  );
}
