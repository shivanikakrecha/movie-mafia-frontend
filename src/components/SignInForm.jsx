// External Dependencies
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import { useTranslation } from 'react-i18next';

// API Imports
import { signIn } from '../api/auth';

/**
 * SignInForm Component
 * Handles user authentication and login functionality
 * 
 * @component
 * @returns {JSX.Element} A form for user authentication
 */
export default function SignInForm() {
  // Hooks
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  /**
   * Handles form submission and user authentication
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   */
  const handleSubmit = async ({ email, password }) => {
    try {
      const data = await signIn(email, password);
      
      // Store authentication token
      localStorage.setItem('authToken', data.access_token);
      
      // Show success message
      notification.success({
        message: t('Success'),
        description: t('Logged in successfully!')
      });
      
      // Redirect to movies list
      navigate('/movies-list');
    } catch (err) {
      notification.error({
        message: t('Error'),
        description: err?.response?.data.detail || t('Login Failed: Invalid credentials!')
      });
      console.error('Login failed:', err);
    }
  };

  // Form validation rules
  const validationRules = {
    email: [
      { 
        required: true, 
        message: t('Please input your Email!'),
        type: 'email'
      }
    ],
    password: [
      { 
        required: true, 
        message: t('Please input your Password!'),
        min: 6
      }
    ]
  };

  // Input field styles
  const inputStyles = {
    size: 'large',
    className: 'custom-input'
  };

  return (
    <div className="signin-form-box">
      <h1 className="signin-title">{t('Sign In')}</h1>
      
      {/* Authentication Form */}
      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
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

        {/* Remember Me Checkbox */}
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox className="remember-me">
            {t("Remember me")}
          </Checkbox>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block
          >
            {t('Login')}
          </Button>
        </Form.Item>

        {/* Sign Up Link */}
        <Form.Item>
          <Button 
            type="default" 
            onClick={() => navigate('/signup')} 
            size="large" 
            block
          >
            {t('SignUp')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}