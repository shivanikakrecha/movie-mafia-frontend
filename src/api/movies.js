import axios from '../services/axiosInstance';

export const addMovie = async (movieData) => {
  const response = await axios.post('/movies', movieData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const editMovie = async (movieId, movieData) => {
  const response = await axios.patch(`/movies/${movieId}`, movieData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchMovie = async (page) => {
  const skip = page <= 1 ? 0 : (page - 1) * 8;
  const limit = 8;
  const response = await axios.get(`/movies/?skip=${skip}&limit=${limit}`);
  // const response = await axios.get('/movies');
  return response.data;
};

export const fetchMovieById = async (id) => {
  const response = await axios.get(`/movies/${id}`);
  return response.data;
};

export const deleteMovieById = async (id) => {
  const response = await axios.delete(`/movies/${id}`);
  return response.data;
};

export const uploadCSVMovies = async (formData) => {
    const response = await axios.post(`/movies/bulk-upload/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};