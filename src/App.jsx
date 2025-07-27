import React, { useState } from 'react';
import CourseTypes from './components/CourseTypes';
import Courses from './components/Courses';
import CourseOfferings from './components/CourseOfferings';
import StudentRegistrations from './components/StudentRegistrations';

function App() {
  const [activeTab, setActiveTab] = useState('course-types');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  
  // State for all entities
  const [courseTypes, setCourseTypes] = useState([
    { id: '1', name: 'Individual', createdAt: new Date() },
    { id: '2', name: 'Group', createdAt: new Date() },
    { id: '3', name: 'Special', createdAt: new Date() },
  ]);
  
  const [courses, setCourses] = useState([
    { id: '1', name: 'Python', createdAt: new Date() },
    { id: '2', name: 'Java', createdAt: new Date() },
    { id: '3', name: 'C++', createdAt: new Date() },
  ]);
  
  const [courseOfferings, setCourseOfferings] = useState([
    { id: '1', courseId: '2', courseTypeId: '1', createdAt: new Date() },
    { id: '2', courseId: '1', courseTypeId: '2', createdAt: new Date() },
  ]);
  
  const [studentRegistrations, setStudentRegistrations] = useState([]);

  const tabs = [
    { 
      id: 'course-types', 
      label: 'Course Types', 
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      )
    },
    { 
      id: 'courses', 
      label: 'Courses', 
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
        </svg>
      )
    },
    { 
      id: 'course-offerings', 
      label: 'Course Offerings', 
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
      )
    },
    { 
      id: 'student-registrations', 
      label: 'Student Registrations', 
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99l-2.98 3.93a.998.998 0 0 0 .22 1.4c.44.32 1.07.25 1.4-.22L15 12h.7l1.8 10h2.5z"/>
        </svg>
      )
    },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'course-types':
        return (
          <CourseTypes
            courseTypes={courseTypes}
            setCourseTypes={setCourseTypes}
          />
        );
      case 'courses':
        return (
          <Courses
            courses={courses}
            setCourses={setCourses}
          />
        );
      case 'course-offerings':
        return (
          <CourseOfferings
            courseOfferings={courseOfferings}
            setCourseOfferings={setCourseOfferings}
            courses={courses}
            courseTypes={courseTypes}
          />
        );
      case 'student-registrations':
        return (
          <StudentRegistrations
            studentRegistrations={studentRegistrations}
            setStudentRegistrations={setStudentRegistrations}
            courseOfferings={courseOfferings}
            courses={courses}
            courseTypes={courseTypes}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>Student Registration System</h1>
          <p>Manage courses, offerings, and student registrations</p>
        </div>

        {/* Navigation */}
<div className="nav-container">
  {/* Mobile Menu Toggle */}
  <div className="mobile-nav-header">
    <h2 className="mobile-brand">Menu</h2>
    <button
      className="hamburger"
      onClick={() => setShowMobileMenu(!showMobileMenu)}
    >
      ☰
    </button>
  </div>

          {/* Mobile Menu Links */}
          <div className={`mobile-nav-links ${showMobileMenu ? 'open' : ''}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowMobileMenu(false);
                }}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Desktop Tabs (hidden on mobile) */}
          <div className="nav-tabs desktop-only">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>


        {/* Content */}
        <div className="fade-in">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}

export default App;