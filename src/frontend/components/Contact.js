import React, { useState } from 'react';

const CONTACT_INFO = [
  { 
    id: 1, 
    icon: 'lni lni-phone', 
    items: ['+91 9724803488','+91 9825400703' ] 
  },
  { 
    id: 2, 
    icon: 'lni lni-envelope', 
    items: ['rkenterprise.p@gmail.com'] 
  },
  { 
    id: 3, 
    icon: 'lni lni-map-marker', 
    items: ["Warehouse: Somnath Industrial Area, Somnath Main Road, Opp. Balaji Pan, Kothariya, Rajkot-360022"] 
  },
];

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  number: '',
  subject: '',
  message: ''
};

const INITIAL_ERROR_STATE = {
  name: '',
  email: '',
  number: '',
  subject: '',
  message: ''
};

const Contact = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState(INITIAL_ERROR_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation as user types
    if (touched[name]) {
      validateField(name, value);
    }
    
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Name can only contain letters and spaces';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)) {
          error = 'Please enter a valid email address (e.g., example@domain.com)';
        }
        break;

      case 'number':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else {
          const cleanNumber = value.replace(/[\s\-()]/g, '');
          if (!/^[0-9]{10}$/.test(cleanNumber)) {
            error = 'Please enter a valid 10-digit phone number';
          } 
        }
        break;

      case 'subject':
        if (!value.trim()) {
          error = 'Subject is required';
        } else if (value.trim().length < 3) {
          error = 'Subject must be at least 3 characters';
        } else if (value.trim().length > 100) {
          error = 'Subject must not exceed 100 characters';
        }
        break;

      case 'message':
        if (!value.trim()) {
          error = 'Message is required';
        } else if (value.trim().length < 10) {
          error = 'Message must be at least 10 characters';
        } else if (value.trim().length > 500) {
          error = 'Message must not exceed 500 characters';
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return error === '';
  };

  const validateForm = () => {
    let isValid = true;
    const fields = ['name', 'email', 'number', 'subject', 'message'];
    
    fields.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) {
        isValid = false;
      }
    });

    // Mark all fields as touched
    const allTouched = {};
    fields.forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Thank you! Your query has been submitted successfully. We will contact you soon.');
        setFormData(INITIAL_FORM_STATE);
        setErrors(INITIAL_ERROR_STATE);
        setTouched({});
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        // Handle server validation errors
        if (data.message) {
          setErrors({ submit: data.message });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit query. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section contact-style-3 section-top">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-5 col-xl-5 col-lg-7 col-md-10">
            <div className="section-title text-center mb-50">
              <h3 className="mb-15 wow fadeInUp" data-wow-delay=".2s">Get in touch</h3>
              <div className="section-title-underline"></div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8">
            <div className="contact-form-wrapper">
              {successMessage && (
                <div className="alert alert-success" style={{
                  padding: '15px',
                  marginBottom: '20px',
                  backgroundColor: '#d4edda',
                  border: '1px solid #c3e6cb',
                  borderRadius: '4px',
                  color: '#155724'
                }}>
                  <i className="lni lni-checkmark-circle" style={{ marginRight: '8px' }}></i>
                  {successMessage}
                </div>
              )}
              
              {errors.submit && (
                <div className="alert alert-danger" style={{
                  padding: '15px',
                  marginBottom: '20px',
                  backgroundColor: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  borderRadius: '4px',
                  color: '#721c24'
                }}>
                  <i className="lni lni-close" style={{ marginRight: '8px' }}></i>
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row">
                  <div className="col-md-6">
                    <div className="single-input">
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <i className="lni lni-user"></i>
                      {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="single-input">
                      <input 
                        type="text"
                        id="email" 
                        name="email" 
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <i className="lni lni-envelope"></i>
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="single-input">
                      <input 
                        type="text" 
                        id="number" 
                        name="number" 
                        className={`form-input ${errors.number ? 'error' : ''}`}
                        placeholder="Number"
                        value={formData.number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <i className="lni lni-phone"></i>
                      {errors.number && <span className="error-message">{errors.number}</span>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="single-input">
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        className={`form-input ${errors.subject ? 'error' : ''}`}
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <i className="lni lni-pencil" aria-hidden="true" title="Subject"></i>
                      {errors.subject && <span className="error-message">{errors.subject}</span>}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="single-input">
                      <textarea 
                        name="message" 
                        id="message" 
                        className={`form-input ${errors.message ? 'error' : ''}`}
                        placeholder="Message" 
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      <i className="lni lni-comments-alt"></i>
                      {errors.message && <span className="error-message">{errors.message}</span>}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-button">
                      <button type="submit" className="button" disabled={isSubmitting}> 
                        <i className="lni lni-telegram-original"></i> 
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="left-wrapper">
              <div className="row">
                {CONTACT_INFO.map((info) => (
                  <div key={info.id} className="col-lg-12 col-md-6">
                    <div className="single-item">
                      <div className="icon">
                        <i className={info.icon}></i>
                      </div>
                      <div className="text">
                        {info.items.map((item, idx) => (
                          <p key={idx}>{item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
