// Login.js
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #030303;
`;

const Content = styled.div`
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 32px;
  font-family: 'Poppins';
  color: #ffffff;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;


const Input = styled.input`
  font-size: 16px;
  font-family: 'Poppins';
  border: 1px solid #ffffff;
  color: #ffffff;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #030303;
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
`;

const EyeIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
`;


const ToggleButton = styled.button`
  position: absolute;
  top: 40%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
`;

const LoginButton = styled.button`
  background-color: #6741d9;
  color: #ffffff;
  border: 1px solid #f0c3f1;
  cursor: pointer;
  font-size: 16px;
  margin-left: 2%;
  font-family: 'Poppins';
  padding: 10px;
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
`;

const SignUpLink = styled.p`
  font-size: 16px;
  font-family: 'Poppins';
  color: #ffffff;
  margin-top: 10px;
`;

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://stg.dhunjam.in/account/admin/login', {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('adminId', response.data.data.id);
        onLogin();
        navigate('/dashboard');
      } else {
        // Handle other status codes if needed
      }
    } catch (error) {
      // Handle network errors or other issues
      console.error('Error during login:', error.message);
    }
  };

  return (
    <Container>
      <Content>
        <Heading>Venue Admin Login</Heading>
        <InputContainer>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash}  />
          </ToggleButton>
        </InputContainer>
        <LoginButton onClick={handleLogin}>Login</LoginButton>
        <SignUpLink>Don't have an account? Sign up</SignUpLink>
      </Content>
    </Container>
  );
};

export default Login;
