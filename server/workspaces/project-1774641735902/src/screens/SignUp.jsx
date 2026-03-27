import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
        <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required />
        <Button type='submit'>Sign Up</Button>
      </Form>
    </Container>
  );
};

export default SignUp;