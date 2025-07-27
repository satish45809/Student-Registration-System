import React, { useState } from 'react';

const Courses = ({ courses, setCourses }) => {
  const [newCourse, setNewCourse] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [errors, setErrors] = useState({});

  const validateName = (name, id = null) => {
    if (!name.trim()) {
      return 'Course name is required';
    }
    if (name.trim().length < 2) {
      return 'Course name must be at least 2 characters';
    }
    const exists = courses.some(c => 
      c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== id
    );
    if (exists) {
      return 'Course name already exists';
    }
    return null;
  };

  const handleCreate = () => {
    const error = validateName(newCourse);
    if (error) {
      setErrors({ new: error });
      return;
    }

    const course = {
      id: Date.now().toString(),
      name: newCourse.trim(),
      createdAt: new Date(),
    };

    setCourses([...courses, course]);
    setNewCourse('');
    setErrors({});
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
    setErrors({});
  };

  const handleSave = (id) => {
    const error = validateName(editingName, id);
    if (error) {
      setErrors({ [id]: error });
      return;
    }

    setCourses(courses.map(c =>
      c.id === id ? { ...c, name: editingName.trim() } : c
    ));
    setEditingId(null);
    setEditingName('');
    setErrors({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingName('');
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleKeyPress = (e, action, id = null) => {
    if (e.key === 'Enter') {
      if (action === 'create') {
        handleCreate();
      } else if (action === 'save') {
        handleSave(id);
      }
    }
  };

  return (
    <div className="card slide-in">
      <div className="card-header">
        <h2 className="card-title">Courses Management</h2>
      </div>
      
      {/* Create New Course */}
      <div className="form-section">
        <h3>Add New Course</h3>
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              value={newCourse}
              onChange={(e) => {
                setNewCourse(e.target.value);
                if (errors.new) setErrors({ ...errors, new: '' });
              }}
              onKeyPress={(e) => handleKeyPress(e, 'create')}
              placeholder="Enter course name"
              className={`form-input ${errors.new ? 'error' : ''}`}
            />
            {errors.new && <div className="error-message">{errors.new}</div>}
          </div>
          <button
            onClick={handleCreate}
            className="btn btn-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add
          </button>
        </div>
      </div>

      {/* Courses List */}
      <div className="items-grid">
        {courses.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
            </svg>
            <h3>No Courses Found</h3>
            <p>Add your first course above to get started.</p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="item-card">
              <div className="item-info">
                {editingId === course.id ? (
                  <div>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => {
                        setEditingName(e.target.value);
                        if (errors[course.id]) {
                          setErrors({ ...errors, [course.id]: '' });
                        }
                      }}
                      onKeyPress={(e) => handleKeyPress(e, 'save', course.id)}
                      className={`edit-input ${errors[course.id] ? 'error' : ''}`}
                    />
                    {errors[course.id] && (
                      <div className="error-message">{errors[course.id]}</div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="item-name">{course.name}</div>
                    <div className="item-meta">
                      Created: {course.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="item-actions">
                {editingId === course.id ? (
                  <>
                    <button
                      onClick={() => handleSave(course.id)}
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
                      onClick={() => handleEdit(course.id, course.name)}
                      className="btn btn-primary btn-icon"
                      title="Edit"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
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

export default Courses;