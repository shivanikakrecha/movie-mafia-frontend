/**
 * @fileoverview Movie management form component that handles both adding and editing movies.
 * Supports single movie upload and bulk CSV upload functionality.
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Upload, Form, Input, Button, Row, Col, notification, Spin, Flex, Tooltip } from 'antd';
import { ArrowRightOutlined, DownloadOutlined } from '@ant-design/icons';
import { addMovie, editMovie, fetchMovieById, uploadCSVMovies } from '../api/movies';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Vectors from '../assets/Vectors.png';
import Title from 'antd/es/typography/Title';
import { useTranslation } from 'react-i18next';

// Constants
const API_URL = import.meta.env.VITE_API_URL;
const { Dragger } = Upload;

// const { t } = useTranslation();
// =============== Custom Hooks =============== //

/**
 * Custom hook to manage form state and image file handling
 * @param {Object} initialData - Initial movie data for editing
 * @returns {Object} Form and file state management objects
 */
const useMovieForm = (initialData = null) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                title: initialData.title,
                year: initialData.year,
            });
            setPreviewUrl(initialData.poster_url);
        }
    }, [initialData, form]);

    return {
        form,
        imageFile,
        setImageFile,
        previewUrl,
        setPreviewUrl
    };
};

/**
 * Custom hook for configuring file upload properties
 * @param {Function} setImageFile - Function to set the image file
 * @param {Function} setPreviewUrl - Function to set the preview URL
 * @returns {Object} Upload configuration object
 */
const useUploadConfig = (setImageFile, setPreviewUrl) => {
    return useMemo(() => ({
        name: 'file',
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            setImageFile(file);
            return false;
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    }), [setImageFile, setPreviewUrl]);
};

// =============== Reusable Components =============== //

/**
 * Component to preview uploaded image
 */
const ImagePreview = ({ url, alt = "Movie" }) => {
    if (!url) return null;

    return (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
            <img
                src={url}
                alt={alt}
                style={{ maxHeight: 250, maxWidth: '100%', borderRadius: 8 }}
            />
        </div>
    );
};

ImagePreview.propTypes = {
    url: PropTypes.string,
    alt: PropTypes.string
};

/**
 * Form action buttons component
 */
const FormButtons = ({ onCancel, isEdit }) => {
    const { t } = useTranslation();

    return (
        <div className="mt-6 flex flex-row gap-4 sm:flex-row sm:gap-4 w-full">
            <Button
                htmlType="button"
                className="bg-[#093545] text-white w-full sm:w-auto"
                onClick={onCancel}
            >
                {t('Cancel')}
            </Button>
            <Button
                type="primary"
                htmlType="submit"
                className="bg-[#2BD17E] border-none w-full sm:w-auto"
            >
                {isEdit ? t('Update') : t('Submit')}
            </Button>
        </div>
    );
};
FormButtons.propTypes = {
    onCancel: PropTypes.func.isRequired,
    isEdit: PropTypes.bool.isRequired
};

/**
 * Bulk CSV upload component
 */
const BulkUpload = ({ setCsvFile, handleCSVUpload }) => {
    const { t } = useTranslation();
    return (
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
                    <p style={{ color: '#FFFFFF' }}>{t('Drag & drop a CSV file here or click to upload')}</p>
                </Dragger>
            </Col>
            <Col span={24} style={{ paddingTop: '20px' }}>
                <Button
                    type="primary"
                    className="bg-[#2BD17E] border-none"
                    onClick={handleCSVUpload}
                >
                    {t('Upload CSV')}
                </Button>
            </Col>
        </Row>
    );
};


BulkUpload.propTypes = {
    setCsvFile: PropTypes.func.isRequired,
    handleCSVUpload: PropTypes.func.isRequired
};

// =============== Main Component =============== //

/**
 * Main movie form component for adding and editing movies
 * Supports both single movie upload and bulk CSV upload
 */
const AddMovieForm = () => {
    // -------- Hooks and State -------- //
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [movieData, setMovieData] = useState(null);
    const [uploadMode, setUploadMode] = useState('single');
    const [csvFile, setCsvFile] = useState(null);

    const { t } = useTranslation();

    const movieDataFromState = location.state?.movieData;
    const { form, imageFile, setImageFile, previewUrl, setPreviewUrl } = useMovieForm(movieData);
    const uploadProps = useUploadConfig(setImageFile, setPreviewUrl);

    // -------- Callback Functions -------- //

    const posterSrc = useCallback((url) => {
        if (!url) return '';
        const isExternal = url.startsWith("http");
        return isExternal ? url : `${API_URL}/${url}`;
    }, []);

    const showNotification = useCallback((type, message, description) => {
        notification[type]({
            message,
            description
        });
    }, []);

    // -------- Event Handlers -------- //

    const handleAddMovie = useCallback(async (formData) => {
        try {
            await addMovie(formData);
            showNotification('success', t('Success'), t('Movie added successfully!'));
            form.resetFields();
            setImageFile(null);
            setPreviewUrl(null);
        } catch (error) {
            showNotification('error', t('Error'), t(error?.response?.data.detail || 'Failed to add movie.'));
            console.error(error);
        }
    }, [form, setImageFile, setPreviewUrl, showNotification]);

    const handleEditMovie = useCallback(async (formData) => {
        try {
            await editMovie(id, formData);
            form.resetFields();
            setImageFile(null);
            setPreviewUrl(null);
            showNotification('success', t('Success'), t('Movie updated successfully!'));
            navigate('/movies-list');
        } catch (error) {
            showNotification('error', t('Error'), t(error?.response?.data.detail || 'Failed to update movie.'));
        }
    }, [id, form, navigate, setImageFile, setPreviewUrl, showNotification]);

    const handleCSVUpload = useCallback(async () => {
        if (!csvFile) {
            showNotification('error', t('Error'), t('Please upload a CSV file.'));
            return;
        }

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            await uploadCSVMovies(formData);
            showNotification('success', t('Success'), t('Movies uploaded successfully!'));
            setCsvFile(null);
        } catch (error) {
            showNotification('error', t('Error'), t(error?.response?.data.detail || 'Failed to upload CSV.'));
        }
    }, [csvFile, showNotification]);

    const onFinish = useCallback((values) => {
        if (!movieData && !imageFile) {
            showNotification('error', t('Error'), t('Please upload an image.'));
            return;
        }

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('year', Number(values.year));
        if (imageFile) {
            formData.append('poster', imageFile);
        }

        if (movieData) {
            handleEditMovie(formData);
        } else {
            handleAddMovie(formData);
        }
    }, [movieData, imageFile, handleAddMovie, handleEditMovie, showNotification]);

    // -------- Side Effects -------- //

    useEffect(() => {
        const fetchMovie = async () => {
            if (!movieDataFromState && id) {
                try {
                    setLoading(true);
                    const response = await fetchMovieById(id);
                    setMovieData(response);
                } catch (error) {
                    showNotification('error', t('Error'), t(error?.response?.data.detail) || t('Failed to fetch movie data'));
                } finally {
                    setLoading(false);
                }
            } else if (movieDataFromState) {
                setMovieData(movieDataFromState);
            }
        };

        fetchMovie();
    }, [id, movieDataFromState, showNotification]);

    // -------- Render Helpers -------- //

    const renderUploadModeSelector = () => (
        !movieData && (
            <Row justify="center">
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label={<span style={{ color: 'white' }}>{t('Upload Mode')}</span>}>
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
                                <option value="single">{t('Single Movie Upload')}</option>
                                <option value="bulk">{t('Bulk Upload (CSV)')}</option>
                            </select>
                        </div>
                    </Form.Item>
                </Col>
            </Row>
        )
    );

    // -------- Render Component -------- //

    return (
        <>
            <div style={{ padding: '40px', backgroundColor: '#0c3d4e', minHeight: '100vh', color: '#fff' }}>
                <Title level={1} className="!m-0 !p-0 !text-white">
                    <div className="text-2xl py-4">
                        <Flex justify="space-between" align="center">
                            {movieData ? t('Edit') : t('Create a new movie')}
                            <Tooltip title={t("Go to movie list")}>
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

                {renderUploadModeSelector()}

                <Spin spinning={loading} size='large'>
                    {uploadMode === 'single' && (
                        <Row gutter={40} align="middle">
                            <Col xs={24} md={8} style={{ height: '504px' }}>
                                <Dragger {...uploadProps}>
                                    <div className='flex flex-col justify-center items-center'>
                                        <p className="ant-upload-drag-icon">
                                            <DownloadOutlined style={{ color: '#FFFFFF' }} />
                                        </p>
                                        <p style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 400 }}>
                                            {t('Click to upload or drag an image here.')}
                                        </p>
                                        <p style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 400 }}>
                                            {t('JPG and PNG files supported.')}
                                        </p>
                                        {previewUrl && <ImagePreview url={previewUrl} />}
                                    </div>
                                </Dragger>
                            </Col>

                            <Col xs={24} md={16}>
                                <Form form={form} layout="vertical" onFinish={onFinish} style={{ paddingTop: '10px' }}>
                                    <Form.Item
                                        name="title"
                                        rules={[{ required: true, message: t('Please input the title!') }]}
                                    >
                                        <Input
                                            placeholder={t('Title')}
                                            style={{
                                                backgroundColor: '#1d4c5c',
                                                color: '#FFFFFF',
                                                fontSize: 14,
                                                fontWeight: 400,
                                                fontFamily: 'Montserrat'
                                            }}
                                            className="custom-input"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="year"
                                        rules={[{
                                            required: true,
                                            message: t('Please input the publishing year!'),
                                            validator: (_, value) => {
                                                if (!value) return Promise.resolve();
                                                const year = Number(value);
                                                if (isNaN(year) || year < 1800 || year > new Date().getFullYear()) {
                                                    return Promise.reject(t('Please enter a valid year between 1800 and current year'));
                                                }
                                                return Promise.resolve();
                                            }
                                        }]}
                                    >
                                        <Input
                                            placeholder={t('Publishing Year')}
                                            style={{
                                                backgroundColor: '#1d4c5c',
                                                color: '#FFFFFF',
                                                fontSize: 14,
                                                fontWeight: 400,
                                                fontFamily: 'Montserrat'
                                            }}
                                            className="custom-input"
                                        />
                                    </Form.Item>

                                    <FormButtons
                                        onCancel={() => navigate('/movies-list')}
                                        isEdit={!!movieData}
                                    />
                                </Form>
                            </Col>
                        </Row>
                    )}
                    {uploadMode === 'bulk' && (
                        <BulkUpload
                            setCsvFile={setCsvFile}
                            handleCSVUpload={handleCSVUpload}
                        />
                    )}
                </Spin>
            </div>
            <img
                src={Vectors}
                className='w-full relative md:absolute md:bottom-0 md:z-0'
                alt="Background vectors"
            />
        </>
    );
};

export default AddMovieForm;
