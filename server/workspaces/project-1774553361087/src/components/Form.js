import React, { useState } from 'react';

const Form = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.name.trim()) validationErrors.name = 'Name is required';
    if (!formData.email.trim() || !/[A-Z0-9._%+-]+@[A-Z0-9.-]+/[A-Z|a-z]{2,}/.test(formData.email)) validationErrors.email = 'Email is invalid';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log('Form submitted successfully', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='name'>Name:</label>
        <input type='text' id='name' name='name' value={formData.name} onChange={handleChange} />
        {errors.name && <p className='error'>{errors.name}</p>}
      </div>
      <div>
        <label htmlFor='email'>Email:</label>
        <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} />
        {errors.email && <p className='error'>{errors.email}</p>}
      </div>
      <button type='submit'>Submit</button>
    </form>
  );
};

export default Form;
