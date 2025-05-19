import React, { useEffect, useState } from 'react';
import { Upload, Form, Input, Button, message, Row, Col, notification, Spin, Flex, Tooltip } from 'antd';
import { ArrowRightOutlined, DownloadOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { addMovie, editMovie, fetchMovieById, uploadCSVMovies } from '../api/movies';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Vectors from '../assets/Vectors.png';
import Title from 'antd/es/typography/Title';

const API_URL = import.meta.env.VITE_API_URL;
const { Dragger } = Upload;

const AddMovieForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [movieData, setMovieData] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [uploadMode, setUploadMode] = useState('single');
    const [csvFile, setCsvFile] = useState(null);

    const movieDataFromState = location.state?.movieData;
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);

    const props = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result); // set base64 preview
            };
            reader.readAsDataURL(file);
            setImageFile(file);
            return false;
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const posterSrc = (url) => {
        const isExternal = url?.startsWith("http");
        const posterUrl = isExternal
            ? url
            : `http://127.0.0.1:8000/${url}`;
        return posterUrl;
    };

    const handleAddMovie = async (formData) => {
        try {
            await addMovie(formData);
            notification.success({
                message: 'Success',
                description: 'Movie added successfully!',
            });
            form.resetFields();
            setImageFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.log("Error: ", error);
            notification.error({ message: 'Error', description: error?.response?.data.detail || 'Failed to add movie.' });
            console.error(error);
        }
    };

    const handleEditMovie = async (formData) => {
        try {
            await editMovie(id, formData);
            form.resetFields();
            setImageFile(null);
            setPreviewUrl(null);
            notification.success({
                message: 'Success',
                description: 'Movie updated successfully!',
            });
            navigate('/movies-list');
        } catch (error) {
            notification.error({ message: 'Error', description: error?.response?.data.detail || 'Failed to update movie.' });
        }
    };

    const handleCSVUpload = async () => {
        if (!csvFile) {
            notification.error({ message: 'Error', description: 'Please upload a CSV file.' });
            return;
        }

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            await uploadCSVMovies(formData);
            notification.success({
                message: 'Success',
                description: 'Movies uploaded successfully!',
            });
            setCsvFile(null);
        } catch (error) {
            console.log("Error: ", error);
            notification.error({ message: 'Error', description: error?.response?.data.detail || 'Failed to upload CSV.' });
        }
    };


    const onFinish = (values) => {
        if (!movieData) {
            if (!imageFile) {
                notification.error({ message: 'Error', description: 'Please upload an image.' });
                return;
            }
        }
        const formData = new FormData();
        formData.append('title', values.title); // correct key names
        formData.append('year', Number(values.year)); // match your field name
        if (imageFile) {
            formData.append('poster', imageFile);
        }

        if (movieData) {
            handleEditMovie(formData);
        } else {
            handleAddMovie(formData);
        }
    };

    useEffect(() => {
        const init = async () => {
            let movie = movieDataFromState;

            if (!movie && id) {
                try {
                    setLoading(true);
                    const response = await fetchMovieById(id);
                    movie = response;
                } catch (error) {
                    notification.error({ message: 'Error', description: error?.response?.data.detail || `Failed to fetch movie data` });
                } finally {
                    setLoading(false);
                }
            }

            if (movie) {
                setMovieData(movie);
                form.setFieldsValue({
                    title: movie.title,
                    year: movie.year,
                });
            }
        };

        init();
    }, [id, movieDataFromState, form]);

    return (
        <>
            <div style={{ padding: '40px', backgroundColor: '#0c3d4e', minHeight: '100vh', color: '#fff' }}>
                <Title level={1} className="!m-0 !p-0 !text-white">
                    <div className="text-2xl py-4">
                        <Flex justify="space-between" align="center">
                            {movieData ? 'Edit' : 'Create a new movie'}
                            <Tooltip title="Go to movie list">
                                <Button
                                    type="link"
                                    size="large"
                                    onClick={() => navigate('/movies-list')}
                                    style={{ color: '#fff' }}
                                    icon={<ArrowRightOutlined className="text-xl sm:text-2xl md:text-3xl" />}
                                />
                            </Tooltip>
                        </Flex>
                    </div>
                </Title>

                <Row justify="center">
                    <Col>
                        <Form.Item
                            label={<span style={{ color: 'white' }}>Upload Mode</span>}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <select
                                    value={uploadMode}
                                    onChange={(e) => setUploadMode(e.target.value)}
                                    style={{
                                        padding: '6px',
                                        borderRadius: '4px',
                                        backgroundColor: '#1d4c5c',
                                        color: 'white',
                                        border: '1px solid #ccc',
                                        minWidth: '220px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <option value="single" style={{ color: 'black' }}>Single Movie Upload</option>
                                    <option value="bulk" style={{ color: 'black' }}>Bulk Upload (CSV)</option>
                                </select>
                            </div>
                        </Form.Item>
                    </Col>
                </Row>

                <Spin spinning={loading} size='large'>
                    {uploadMode === 'single' && (
                        <Row gutter={40} align="middle">
                            <Col xs={24} md={8} style={{ height: '504px' }}>

                                <Dragger {...props}>
                                    <div className='flex flex-col justify-center items-center'>
                                        <p className="ant-upload-drag-icon">
                                            <DownloadOutlined style={{ color: '#FFFFFF' }} />
                                        </p>
                                        <p style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 400 }}>Click to upload or drag an image here.</p>
                                        <p style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 400 }}>JPG and PNG files supported.</p>
                                        {(previewUrl || movieData?.poster_url) && (
                                            <div style={{ marginTop: 16, textAlign: 'center' }}>
                                                <img
                                                    src={previewUrl || posterSrc(movieData?.poster_url)}
                                                    alt="Movie"
                                                    style={{ maxHeight: 250, maxWidth: '100%', borderRadius: 8 }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Dragger>
                            </Col>

                            <Col xs={24} md={16}>
                                <Form form={form} layout="vertical" onFinish={onFinish} style={{ paddingTop: '10px' }}>
                                    <Form.Item
                                        //   label="Title"
                                        name="title"
                                        rules={[{ required: true, message: 'Please input the title!' }]}
                                    >
                                        <Input
                                            placeholder='Title'
                                            style={{ backgroundColor: '#1d4c5c', color: '#FFFFFF', fontSize: 14, fontWeight: 400, fontFamily: 'Montserrat' }}
                                            className="custom-input"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        //   label="Publishing Year"
                                        name="year"
                                        rules={[{ required: true, message: 'Please input the publishing year!' }]}
                                    >
                                        <Input
                                            placeholder='Publishing Year'
                                            style={{ backgroundColor: '#1d4c5c', color: '#FFFFFF', fontSize: 14, fontWeight: 400, fontFamily: 'Montserrat' }}
                                            className="custom-input"
                                        />
                                    </Form.Item>

                                    {/* Buttons Below Form on All Devices */}
                                    <div className="mt-6 flex flex-row gap-4 sm:flex-row sm:gap-4 w-full">
                                        <Button
                                            htmlType="button"
                                            className="bg-[#093545] text-white w-full sm:w-auto"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="bg-[#2BD17E] border-none w-full sm:w-auto"
                                        >
                                            {movieData ? 'Update' : 'Submit'}
                                        </Button>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    )}
                    {uploadMode === 'bulk' && (
                        <Row gutter={40} align="middle" style={{ paddingTop: '30px' }}>
                            <Col span={24}>
                                <Dragger
                                    name="csv"
                                    accept=".csv"
                                    multiple={false}
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        setCsvFile(file);
                                        return false;
                                    }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <DownloadOutlined style={{ color: '#FFFFFF' }} />
                                    </p>
                                    <p style={{ color: '#FFFFFF' }}>Drag & drop a CSV file here or click to upload</p>
                                </Dragger>
                            </Col>
                            <Col span={24} style={{ paddingTop: '20px' }}>
                                <Button
                                    type="primary"
                                    className="bg-[#2BD17E] border-none"
                                    onClick={handleCSVUpload}
                                >
                                    Upload CSV
                                </Button>
                            </Col>
                        </Row>
                    )}

                </Spin>
            </div>
            <img src={Vectors} className='w-full relative md:absolute md:bottom-0 md:z-0'></img>
        </>
    );
};

export default AddMovieForm;
