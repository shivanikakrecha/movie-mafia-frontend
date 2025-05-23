// External Dependencies
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';

// API Imports
import { registerUser } from '../api/auth';
import { useTranslation } from 'react-i18next';

/**
 * SignUp Component
 * Handles user registration functionality
 * 
 * @component
 * @returns {JSX.Element} Registration form
 */
export default function SignUp() {
  // Hooks
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  /**
   * Handles form submission for user registration
   * @param {Object} values - Form values
   */
  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      is_active: true,
      is_admin: false,
    };

    try {
      await registerUser(payload);
      
      // Show success message
      notification.success({
        message: t('Success'),
        description: t('Registered successfully!')
      });
      
      // Redirect to sign in
      navigate('/signin');
    } catch (error) {
      notification.error({
        message: t('Error'),
        description: t(error.response?.data?.detail || 'Registration failed')
      });
      console.error('Registration Error:', error);
    }
  };

  // Form validation rules
  const validationRules = {
    full_name: [
      { 
        required: true, 
        message: t('Please enter full name!'),
        min: 2
      }
    ],
    email: [
      { 
        required: true, 
        message: t('Please enter your Email!'),
        type: 'email'
      }
    ],
    password: [
      { 
        required: true, 
        message: t('Please enter your Password!'),
        min: 6
      }
    ]
  };

  // Styles
  const inputStyles = {
    size: 'large',
    className: 'custom-input'
  };

  return (
    <div className="signin-form-box">
      <h1 className="signin-title">{t('Sign Up')}</h1>
      
      {/* Registration Form */}
      <Form
        form={form}
        name="signup"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        {/* Full Name Field */}
        <Form.Item
          name="full_name"
          rules={validationRules.full_name}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t("Full Name")}
            {...inputStyles}
          />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          name="email"
          rules={validationRules.email}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t("Email")}
            {...inputStyles}
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          name="password"
          rules={validationRules.password}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t("Password")}
            {...inputStyles}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block
          >
            {t('Sign Up')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}