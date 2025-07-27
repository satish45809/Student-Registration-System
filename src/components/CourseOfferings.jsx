import React, { useState } from 'react';

const CourseOfferings = ({ courseOfferings, setCourseOfferings, courses, courseTypes }) => {
  const [newOffering, setNewOffering] = useState({ courseId: '', courseTypeId: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingOffering, setEditingOffering] = useState({ courseId: '', courseTypeId: '' });
  const [errors, setErrors] = useState({});

  const validateOffering = (courseId, courseTypeId, id = null) => {
    if (!courseId) {
      return 'Please select a course';
    }
    if (!courseTypeId) {
      return 'Please select a course type';
    }
    const exists = courseOfferings.some(co => 
      co.courseId === courseId && co.courseTypeId === courseTypeId && co.id !== id
    );
    if (exists) {
      return 'This course offering already exists';
    }
    return null;
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  const getCourseTypeName = (courseTypeId) => {
    const courseType = courseTypes.find(ct => ct.id === courseTypeId);
    return courseType ? courseType.name : 'Unknown Type';
  };

  const handleCreate = () => {
    const error = validateOffering(newOffering.courseId, newOffering.courseTypeId);
    if (error) {
      setErrors({ new: error });
      return;
    }

    const courseOffering = {
      id: Date.now().toString(),
      courseId: newOffering.courseId,
      courseTypeId: newOffering.courseTypeId,
      createdAt: new Date(),
    };

    setCourseOfferings([...courseOfferings, courseOffering]);
    setNewOffering({ courseId: '', courseTypeId: '' });
    setErrors({});
  };

  const handleEdit = (id, courseId, courseTypeId) => {
    setEditingId(id);
    setEditingOffering({ courseId, courseTypeId });
    setErrors({});
  };

  const handleSave = (id) => {
    const error = validateOffering(editingOffering.courseId, editingOffering.courseTypeId, id);
    if (error) {
      setErrors({ [id]: error });
      return;
    }

    setCourseOfferings(courseOfferings.map(co =>
      co.id === id ? { 
        ...co, 
        courseId: editingOffering.courseId, 
        courseTypeId: editingOffering.courseTypeId 
      } : co
    ));
    setEditingId(null);
    setEditingOffering({ courseId: '', courseTypeId: '' });
    setErrors({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingOffering({ courseId: '', courseTypeId: '' });
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course offering?')) {
      setCourseOfferings(courseOfferings.filter(co => co.id !== id));
    }
  };

  return (
    <div className="card slide-in">
      <div className="card-header">
        <h2 className="card-title">Course Offerings Management</h2>
      </div>
      
      {/* Create New Course Offering */}
      <div className="form-section">
        <h3>Add New Course Offering</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Course</label>
            <select
              value={newOffering.courseId}
              onChange={(e) => {
                setNewOffering({ ...newOffering, courseId: e.target.value });
                if (errors.new) setErrors({ ...errors, new: '' });
              }}
              className={`form-select ${errors.new ? 'error' : ''}`}
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Course Type</label>
            <select
              value={newOffering.courseTypeId}
              onChange={(e) => {
                setNewOffering({ ...newOffering, courseTypeId: e.target.value });
                if (errors.new) setErrors({ ...errors, new: '' });
              }}
              className={`form-select ${errors.new ? 'error' : ''}`}
            >
              <option value="">Select Course Type</option>
              {courseTypes.map(courseType => (
                <option key={courseType.id} value={courseType.id}>{courseType.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreate}
            className="btn btn-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Offering
          </button>
        </div>
        {errors.new && <div className="error-message">{errors.new}</div>}
      </div>

      {/* Course Offerings List */}
      <div className="items-grid">
        {courseOfferings.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
            </svg>
            <h3>No Course Offerings Found</h3>
            <p>Create your first course offering above to get started.</p>
          </div>
        ) : (
          courseOfferings.map((offering) => (
            <div key={offering.id} className="item-card">
              <div className="item-info">
                {editingId === offering.id ? (
                  <div>
                    <div className="form-row" style={{ marginBottom: '10px' }}>
                      <div className="form-group">
                        <select
                          value={editingOffering.courseId}
                          onChange={(e) => {
                            setEditingOffering({ ...editingOffering, courseId: e.target.value });
                            if (errors[offering.id]) {
                              setErrors({ ...errors, [offering.id]: '' });
                            }
                          }}
                          className={`form-select ${errors[offering.id] ? 'error' : ''}`}
                        >
                          <option value="">Select Course</option>
                          {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <select
                          value={editingOffering.courseTypeId}
                          onChange={(e) => {
                            setEditingOffering({ ...editingOffering, courseTypeId: e.target.value });
                            if (errors[offering.id]) {
                              setErrors({ ...errors, [offering.id]: '' });
                            }
                          }}
                          className={`form-select ${errors[offering.id] ? 'error' : ''}`}
                        >
                          <option value="">Select Course Type</option>
                          {courseTypes.map(courseType => (
                            <option key={courseType.id} value={courseType.id}>{courseType.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {errors[offering.id] && (
                      <div className="error-message">{errors[offering.id]}</div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="item-name">
                      {getCourseTypeName(offering.courseTypeId)} - {getCourseName(offering.courseId)}
                    </div>
                    <div className="item-meta">
                      Created: {offering.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="item-actions">
                {editingId === offering.id ? (
                  <>
                    <button
                      onClick={() => handleSave(offering.id)}
                      className="btn btn-success btn-icon"
                      title="Save"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn btn-secondary btn-icon"
                      title="Cancel"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(offering.id, offering.courseId, offering.courseTypeId)}
                      className="btn btn-primary btn-icon"
                      title="Edit"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(offering.id)}
                      className="btn btn-danger btn-icon"
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseOfferings;