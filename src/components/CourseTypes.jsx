import React, { useState } from 'react';

const CourseTypes = ({ courseTypes, setCourseTypes }) => {
  const [newCourseType, setNewCourseType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [errors, setErrors] = useState({});

  const validateName = (name, id = null) => {
    if (!name.trim()) {
      return 'Course type name is required';
    }
    if (name.trim().length < 2) {
      return 'Course type name must be at least 2 characters';
    }
    const exists = courseTypes.some(ct => 
      ct.name.toLowerCase() === name.trim().toLowerCase() && ct.id !== id
    );
    if (exists) {
      return 'Course type name already exists';
    }
    return null;
  };

  const handleCreate = () => {
    const error = validateName(newCourseType);
    if (error) {
      setErrors({ new: error });
      return;
    }

    const courseType = {
      id: Date.now().toString(),
      name: newCourseType.trim(),
      createdAt: new Date(),
    };

    setCourseTypes([...courseTypes, courseType]);
    setNewCourseType('');
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

    setCourseTypes(courseTypes.map(ct =>
      ct.id === id ? { ...ct, name: editingName.trim() } : ct
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
    if (window.confirm('Are you sure you want to delete this course type?')) {
      setCourseTypes(courseTypes.filter(ct => ct.id !== id));
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
        <h2 className="card-title">Course Types Management</h2>
      </div>
      
      {/* Create New Course Type */}
      <div className="form-section">
        <h3>Add New Course Type</h3>
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              value={newCourseType}
              onChange={(e) => {
                setNewCourseType(e.target.value);
                if (errors.new) setErrors({ ...errors, new: '' });
              }}
              onKeyPress={(e) => handleKeyPress(e, 'create')}
              placeholder="Enter course type name"
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

      {/* Course Types List */}
      <div className="items-grid">
        {courseTypes.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <h3>No Course Types Found</h3>
            <p>Add your first course type above to get started.</p>
          </div>
        ) : (
          courseTypes.map((courseType) => (
            <div key={courseType.id} className="item-card">
              <div className="item-info">
                {editingId === courseType.id ? (
                  <div>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => {
                        setEditingName(e.target.value);
                        if (errors[courseType.id]) {
                          setErrors({ ...errors, [courseType.id]: '' });
                        }
                      }}
                      onKeyPress={(e) => handleKeyPress(e, 'save', courseType.id)}
                      className={`edit-input ${errors[courseType.id] ? 'error' : ''}`}
                    />
                    {errors[courseType.id] && (
                      <div className="error-message">{errors[courseType.id]}</div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="item-name">{courseType.name}</div>
                    <div className="item-meta">
                      Created: {courseType.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="item-actions">
                {editingId === courseType.id ? (
                  <>
                    <button
                      onClick={() => handleSave(courseType.id)}
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
                      onClick={() => handleEdit(courseType.id, courseType.name)}
                      className="btn btn-primary btn-icon"
                      title="Edit"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(courseType.id)}
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

export default CourseTypes;