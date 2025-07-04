import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, User, MapPin, Video, Phone, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Appointment {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: 'meeting' | 'call' | 'video' | 'other';
  attendees: string[];
  location?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  relatedTo: string;
}

interface CalendarProps {
  searchTerm: string;
}

const Calendar: React.FC<CalendarProps> = ({ searchTerm }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      title: 'Product Demo with TechCorp',
      description: 'Demonstrate our enterprise software solution',
      date: '2024-01-16',
      time: '10:00',
      duration: 60,
      type: 'video',
      attendees: ['Sarah Johnson', 'Mike Wilson'],
      location: 'Zoom Meeting',
      status: 'confirmed',
      relatedTo: 'TechCorp Solutions',
    },
    {
      id: 2,
      title: 'Contract Negotiation Call',
      description: 'Discuss terms and pricing for cloud migration project',
      date: '2024-01-17',
      time: '14:30',
      duration: 45,
      type: 'call',
      attendees: ['Michael Chen'],
      status: 'scheduled',
      relatedTo: 'Innovate.io',
    },
    {
      id: 3,
      title: 'Quarterly Business Review',
      description: 'Review performance and discuss future opportunities',
      date: '2024-01-18',
      time: '09:00',
      duration: 120,
      type: 'meeting',
      attendees: ['Emily Rodriguez', 'John Smith', 'Lisa Brown'],
      location: 'Conference Room A',
      status: 'confirmed',
      relatedTo: 'Digital Future Inc',
    },
    {
      id: 4,
      title: 'Follow-up Meeting',
      description: 'Follow up on proposal and next steps',
      date: '2024-01-19',
      time: '11:00',
      duration: 30,
      type: 'video',
      attendees: ['David Kim'],
      location: 'Google Meet',
      status: 'scheduled',
      relatedTo: 'StartupX',
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    type: 'meeting' as Appointment['type'],
    attendees: '',
    location: '',
    status: 'scheduled' as Appointment['status'],
    relatedTo: '',
  });

  const filteredAppointments = appointments.filter(appointment =>
    appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.relatedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-blue-600" />;
      case 'call':
        return <Phone size={16} className="text-green-600" />;
      case 'meeting':
        return <User size={16} className="text-purple-600" />;
      default:
        return <CalendarIcon size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(weekDate);
    }
    return weekDates;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'month') {
        if (direction === 'prev') {
          newDate.setMonth(prev.getMonth() - 1);
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
      } else if (view === 'week') {
        if (direction === 'prev') {
          newDate.setDate(prev.getDate() - 7);
        } else {
          newDate.setDate(prev.getDate() + 7);
        }
      } else if (view === 'day') {
        if (direction === 'prev') {
          newDate.setDate(prev.getDate() - 1);
        } else {
          newDate.setDate(prev.getDate() + 1);
        }
      }
      return newDate;
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: selectedDate || '',
      time: '',
      duration: '60',
      type: 'meeting',
      attendees: '',
      location: '',
      status: 'scheduled',
      relatedTo: '',
    });
  };

  const handleAddAppointment = () => {
    if (!formData.title || !formData.date || !formData.time) return;

    const newAppointment: Appointment = {
      id: Math.max(...appointments.map(a => a.id)) + 1,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration),
      type: formData.type,
      attendees: formData.attendees.split(',').map(a => a.trim()).filter(a => a),
      location: formData.location,
      status: formData.status,
      relatedTo: formData.relatedTo,
    };

    setAppointments([...appointments, newAppointment]);
    resetForm();
    setShowAddModal(false);
    setSelectedDate('');
  };

  const handleEditAppointment = () => {
    if (!selectedAppointment || !formData.title || !formData.date || !formData.time) return;

    setAppointments(appointments.map(apt =>
      apt.id === selectedAppointment.id
        ? {
            ...apt,
            title: formData.title,
            description: formData.description,
            date: formData.date,
            time: formData.time,
            duration: parseInt(formData.duration),
            type: formData.type,
            attendees: formData.attendees.split(',').map(a => a.trim()).filter(a => a),
            location: formData.location,
            status: formData.status,
            relatedTo: formData.relatedTo,
          }
        : apt
    ));
    setShowEditModal(false);
    setSelectedAppointment(null);
    resetForm();
  };

  const handleDeleteAppointment = () => {
    if (!selectedAppointment) return;

    setAppointments(appointments.filter(apt => apt.id !== selectedAppointment.id));
    setShowDeleteModal(false);
    setSelectedAppointment(null);
  };

  const openEditModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      title: appointment.title,
      description: appointment.description,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration.toString(),
      type: appointment.type,
      attendees: appointment.attendees.join(', '),
      location: appointment.location || '',
      status: appointment.status,
      relatedTo: appointment.relatedTo,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setFormData(prev => ({ ...prev, date: dateStr }));
    setShowAddModal(true);
  };

  const formatDateHeader = () => {
    if (view === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (view === 'week') {
      const weekDates = getWeekDates(currentDate);
      const startDate = weekDates[0];
      const endDate = weekDates[6];
      if (startDate.getMonth() === endDate.getMonth()) {
        return `${startDate.toLocaleDateString('en-US', { month: 'long' })} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
      } else {
        return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${startDate.getFullYear()}`;
      }
    } else {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAppointments = filteredAppointments.filter(apt => apt.date === dateStr);
      const isToday = today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
      
      days.push(
        <div 
          key={day} 
          className={`h-24 border border-gray-200 p-1 cursor-pointer ${isToday ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}
          onClick={() => handleDateClick(dateStr)}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayAppointments.slice(0, 2).map(apt => (
              <div 
                key={apt.id} 
                className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(apt);
                }}
              >
                {apt.time} {apt.title}
              </div>
            ))}
            {dayAppointments.length > 2 && (
              <div className="text-xs text-gray-500">+{dayAppointments.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-0">
          {days}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    const today = new Date();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="p-4">
        {/* Week header */}
        <div className="grid grid-cols-8 gap-0 mb-4">
          <div className="p-2 text-center text-sm font-medium text-gray-600">Time</div>
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const dateStr = date.toISOString().split('T')[0];
            return (
              <div 
                key={index} 
                className={`p-2 text-center cursor-pointer rounded-lg transition-colors ${
                  isToday ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleDateClick(dateStr)}
              >
                <div className="text-xs text-gray-600">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-8 gap-0 border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="p-2 text-xs text-gray-500 border-r border-gray-200 bg-gray-50 text-center">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {weekDates.map((date, dayIndex) => {
                const dateStr = date.toISOString().split('T')[0];
                const hourAppointments = filteredAppointments.filter(apt => {
                  if (apt.date !== dateStr) return false;
                  const aptHour = parseInt(apt.time.split(':')[0]);
                  return aptHour === hour;
                });

                return (
                  <div 
                    key={`${hour}-${dayIndex}`} 
                    className="h-12 border-r border-b border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors relative"
                    onClick={() => {
                      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                      setSelectedDate(dateStr);
                      setFormData(prev => ({ ...prev, date: dateStr, time: timeStr }));
                      setShowAddModal(true);
                    }}
                  >
                    {hourAppointments.map(apt => (
                      <div 
                        key={apt.id}
                        className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded truncate cursor-pointer hover:bg-blue-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(apt);
                        }}
                      >
                        {apt.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const today = new Date();
    const isToday = currentDate.toDateString() === today.toDateString();
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayAppointments = filteredAppointments.filter(apt => apt.date === dateStr);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="p-4">
        {/* Day header */}
        <div className="mb-6 text-center">
          <div className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {currentDate.getDate()}
          </div>
          <div className="text-sm text-gray-600">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', year: 'numeric' })}
          </div>
          {isToday && (
            <div className="text-xs text-blue-600 font-medium mt-1">Today</div>
          )}
        </div>

        {/* Day schedule */}
        <div className="max-w-2xl mx-auto">
          <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            {hours.map(hour => {
              const hourAppointments = dayAppointments.filter(apt => {
                const aptHour = parseInt(apt.time.split(':')[0]);
                return aptHour === hour;
              });

              return (
                <div key={hour} className="flex border-b border-gray-200">
                  <div className="w-20 p-3 text-sm text-gray-500 bg-gray-50 border-r border-gray-200 text-center">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  <div 
                    className="flex-1 p-3 min-h-16 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                      setSelectedDate(dateStr);
                      setFormData(prev => ({ ...prev, date: dateStr, time: timeStr }));
                      setShowAddModal(true);
                    }}
                  >
                    {hourAppointments.length === 0 ? (
                      <div className="text-gray-400 text-sm">Click to add appointment</div>
                    ) : (
                      <div className="space-y-2">
                        {hourAppointments.map(apt => (
                          <div 
                            key={apt.id}
                            className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(apt);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {getTypeIcon(apt.type)}
                                <span className="font-medium text-gray-900">{apt.title}</span>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                {apt.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{apt.description}</div>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                              <div className="flex items-center space-x-1">
                                <Clock size={12} />
                                <span>{apt.time} ({apt.duration} min)</span>
                              </div>
                              {apt.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin size={12} />
                                  <span>{apt.location}</span>
                                </div>
                              )}
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
        </div>
      </div>
    );
  };

  const renderCalendarContent = () => {
    switch (view) {
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      default:
        return renderMonthView();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Calendar & Appointments</h3>
          <p className="text-sm text-gray-600">Schedule and manage your appointments</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === 'month' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === 'week' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === 'day' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Day
            </button>
          </div>
          <button 
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                  {formatDateHeader()}
                </h3>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Today
              </button>
            </div>

            {/* Calendar Content */}
            {renderCalendarContent()}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4">Upcoming Appointments</h4>
            <div className="space-y-4">
              {filteredAppointments
                .filter(apt => new Date(apt.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map(appointment => (
                  <div key={appointment.id} className="border-l-4 border-blue-500 pl-4 py-2 cursor-pointer hover:bg-gray-50 rounded-r-lg transition-colors"
                       onClick={() => openEditModal(appointment)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getTypeIcon(appointment.type)}
                          <h5 className="font-medium text-gray-900 text-sm">{appointment.title}</h5>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{appointment.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon size={12} />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4">This Week</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Appointments</span>
                <span className="font-semibold text-gray-900">{filteredAppointments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Confirmed</span>
                <span className="font-semibold text-green-600">
                  {filteredAppointments.filter(apt => apt.status === 'confirmed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold text-blue-600">
                  {filteredAppointments.filter(apt => apt.status === 'scheduled').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Schedule New Appointment</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedDate('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter appointment title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter appointment description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Appointment['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="meeting">In-Person Meeting</option>
                  <option value="video">Video Call</option>
                  <option value="call">Phone Call</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter location or meeting link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
                <input
                  type="text"
                  value={formData.attendees}
                  onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter attendees (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related To</label>
                <input
                  type="text"
                  value={formData.relatedTo}
                  onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter related company or contact"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedDate('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAppointment}
                disabled={!formData.title || !formData.date || !formData.time}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Appointment</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openDeleteModal(selectedAppointment)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter appointment title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter appointment description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Appointment['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="meeting">In-Person Meeting</option>
                  <option value="video">Video Call</option>
                  <option value="call">Phone Call</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter location or meeting link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
                <input
                  type="text"
                  value={formData.attendees}
                  onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter attendees (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related To</label>
                <input
                  type="text"
                  value={formData.relatedTo}
                  onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter related company or contact"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditAppointment}
                disabled={!formData.title || !formData.date || !formData.time}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Delete Appointment</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{selectedAppointment.title}</strong>? 
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAppointment}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;