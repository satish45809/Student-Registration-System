import React, { useState } from 'react';

const StudentRegistrations = ({ 
  studentRegistrations, 
  setStudentRegistrations, 
  courseOfferings, 
  courses, 
  courseTypes 
}) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [newRegistration, setNewRegistration] = useState({
    studentName: '',
    studentEmail: '',
    courseOfferingId: '',
  });
  const [selectedCourseType, setSelectedCourseType] = useState('');
  const [selectedOffering, setSelectedOffering] = useState('');
  const [errors, setErrors] = useState({});

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  const getCourseTypeName = (courseTypeId) => {
    const courseType = courseTypes.find(ct => ct.id === courseTypeId);
    return courseType ? courseType.name : 'Unknown Type';
  };

  const getOfferingDisplayName = (offering) => {
    return `${getCourseTypeName(offering.courseTypeId)} - ${getCourseName(offering.courseId)}`;
  };

  const filteredOfferings = selectedCourseType
    ? courseOfferings.filter(offering => offering.courseTypeId === selectedCourseType)
    : courseOfferings;

  const getRegistrationsForOffering = (offeringId) => {
    return studentRegistrations.filter(reg => reg.courseOfferingId === offeringId);
  };

  const validateRegistration = () => {
    const newErrors = {};

    if (!newRegistration.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    } else if (newRegistration.studentName.trim().length < 2) {
      newErrors.studentName = 'Student name must be at least 2 characters';
    }

    if (!newRegistration.studentEmail.trim()) {
      newErrors.studentEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newRegistration.studentEmail)) {
      newErrors.studentEmail = 'Please enter a valid email address';
    }

    if (!newRegistration.courseOfferingId) {
      newErrors.courseOfferingId = 'Please select a course offering';
    }

    // Check if student is already registered for this offering
    const existingRegistration = studentRegistrations.find(
      reg => reg.studentEmail.toLowerCase() === newRegistration.studentEmail.toLowerCase() 
        && reg.courseOfferingId === newRegistration.courseOfferingId
    );
    if (existingRegistration) {
      newErrors.duplicate = 'This student is already registered for this course offering';
    }

    return newErrors;
  };

  const handleCreateRegistration = () => {
    const validationErrors = validateRegistration();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const registration = {
      id: Date.now().toString(),
      studentName: newRegistration.studentName.trim(),
      studentEmail: newRegistration.studentEmail.toLowerCase().trim(),
      courseOfferingId: newRegistration.courseOfferingId,
      registrationDate: new Date(),
    };

    setStudentRegistrations([...studentRegistrations, registration]);
    setNewRegistration({ studentName: '', studentEmail: '', courseOfferingId: '' });
    setErrors({});
    setShowRegistrationForm(false);
  };

  const handleCancelRegistration = () => {
    setNewRegistration({ studentName: '', studentEmail: '', courseOfferingId: '' });
    setErrors({});
    setShowRegistrationForm(false);
  };

  return (
    <div className="card slide-in">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="card-title">Student Registrations</h2>
        <button
          onClick={() => setShowRegistrationForm(true)}
          className="btn btn-primary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Register Student
        </button>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Register New Student</h3>
              <button
                onClick={handleCancelRegistration}
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <div>
              <div className="form-group">
                <label>Student Name</label>
                <input
                  type="text"
                  value={newRegistration.studentName}
                  onChange={(e) => {
                    setNewRegistration({ ...newRegistration, studentName: e.target.value });
                    if (errors.studentName) setErrors({ ...errors, studentName: '' });
                  }}
                  className={`form-input ${errors.studentName ? 'error' : ''}`}
                  placeholder="Enter student name"
                />
                {errors.studentName && <div className="error-message">{errors.studentName}</div>}
              </div>

              <div className="form-group">
                <label>Student Email</label>
                <input
                  type="email"
                  value={newRegistration.studentEmail}
                  onChange={(e) => {
                    setNewRegistration({ ...newRegistration, studentEmail: e.target.value });
                    if (errors.studentEmail) setErrors({ ...errors, studentEmail: '' });
                  }}
                  className={`form-input ${errors.studentEmail ? 'error' : ''}`}
                  placeholder="Enter student email"
                />
                {errors.studentEmail && <div className="error-message">{errors.studentEmail}</div>}
              </div>

              <div className="form-group">
                <label>Course Offering</label>
                <select
                  value={newRegistration.courseOfferingId}
                  onChange={(e) => {
                    setNewRegistration({ ...newRegistration, courseOfferingId: e.target.value });
                    if (errors.courseOfferingId) setErrors({ ...errors, courseOfferingId: '' });
                  }}
                  className={`form-select ${errors.courseOfferingId ? 'error' : ''}`}
                >
                  <option value="">Select Course Offering</option>
                  {courseOfferings.map(offering => (
                    <option key={offering.id} value={offering.id}>
                      {getOfferingDisplayName(offering)}
                    </option>
                  ))}
                </select>
                {errors.courseOfferingId && <div className="error-message">{errors.courseOfferingId}</div>}
              </div>

              {errors.duplicate && <div className="error-message">{errors.duplicate}</div>}

              <div className="modal-actions">
                <button
                  onClick={handleCreateRegistration}
                  className="btn btn-primary"
                >
                  Register Student
                </button>
                <button
                  onClick={handleCancelRegistration}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
            </svg>
            Filter by:
          </div>
          <div className="form-group">
            <select
              value={selectedCourseType}
              onChange={(e) => setSelectedCourseType(e.target.value)}
              className="form-select"
            >
              <option value="">All Course Types</option>
              {courseTypes.map(courseType => (
                <option key={courseType.id} value={courseType.id}>{courseType.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select
              value={selectedOffering}
              onChange={(e) => setSelectedOffering(e.target.value)}
              className="form-select"
            >
              <option value="">All Offerings</option>
              {filteredOfferings.map(offering => (
                <option key={offering.id} value={offering.id}>
                  {getOfferingDisplayName(offering)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Offerings and Registrations */}
      <div>
        {filteredOfferings
          .filter(offering => !selectedOffering || offering.id === selectedOffering)
          .map((offering) => {
            const registrations = getRegistrationsForOffering(offering.id);
            return (
              <div key={offering.id} className="offering-card">
                <div className="offering-header">
                  <h3 className="offering-title">
                    {getOfferingDisplayName(offering)}
                  </h3>
                  <div className="offering-count">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99l-2.98 3.93a.998.998 0 0 0 .22 1.4c.44.32 1.07.25 1.4-.22L15 12h.7l1.8 10h2.5z"/>
                    </svg>
                    <span>{registrations.length} student{registrations.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div className="offering-content">
                  {registrations.length === 0 ? (
                    <div className="empty-state">
                      <svg className="empty-state-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99l-2.98 3.93a.998.998 0 0 0 .22 1.4c.44.32 1.07.25 1.4-.22L15 12h.7l1.8 10h2.5z"/>
                      </svg>
                      <h3>No Students Registered</h3>
                      <p>No students have registered for this course offering yet.</p>
                    </div>
                  ) : (
                    <div className="student-list">
                      {registrations.map((registration) => (
                        <div key={registration.id} className="student-card">
                          <div className="student-info">
                            <h4>{registration.studentName}</h4>
                            <p>{registration.studentEmail}</p>
                          </div>
                          <div className="student-meta">
                            <p>Registered: {registration.registrationDate.toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {courseOfferings.length === 0 && (
        <div className="empty-state">
          <svg className="empty-state-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
          </svg>
          <h3>No Course Offerings Available</h3>
          <p>Please create course offerings first before registering students.</p>
        </div>
      )}
    </div>
  );
};

export default StudentRegistrations;