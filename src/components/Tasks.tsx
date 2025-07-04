import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, User, AlertCircle, CheckCircle2, Circle, Edit, Trash2, X, Phone, Mail, Users, FileText, Grid, Columns, Filter } from 'lucide-react';
import { taskService, Task, CreateTaskData, UpdateTaskData } from '../services/taskService';

interface TasksProps {
  searchTerm: string;
}

type ViewMode = 'list' | 'status' | 'priority';

const Tasks: React.FC<TasksProps> = ({ searchTerm }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    type: 'Other',
    priority: 'Medium',
    status: 'Open',
    due_date: '',
    related_to: '',
  });

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.related_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.assignee?.name && task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Closed':
        return <CheckCircle2 size={20} className="text-green-600" />;
      case 'In Progress':
        return <Clock size={20} className="text-blue-600" />;
      case 'Open':
        return <Circle size={20} className="text-gray-400" />;
      default:
        return <Circle size={20} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Closed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Open':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'call':
        return <Phone size={16} className="text-green-600" />;
      case 'email':
        return <Mail size={16} className="text-blue-600" />;
      case 'meeting':
        return <Users size={16} className="text-purple-600" />;
      case 'follow-up':
        return <Clock size={16} className="text-orange-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && 
           new Date(dueDate).toDateString() !== new Date().toDateString() &&
           status !== 'Completed' && status !== 'Closed';
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'Other',
      priority: 'Medium',
      status: 'Open',
      due_date: '',
      related_to: '',
    });
  };

  const handleAddTask = async () => {
    if (!formData.title || !formData.due_date) return;

    try {
      await taskService.createTask(formData);
      await loadTasks(); // Reload tasks
      resetForm();
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to create task:', err);
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleEditTask = async () => {
    if (!selectedTask || !formData.title || !formData.due_date) return;

    try {
      await taskService.updateTask(selectedTask.id, formData);
      await loadTasks(); // Reload tasks
      setShowEditModal(false);
      setSelectedTask(null);
      resetForm();
    } catch (err) {
      console.error('Failed to update task:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      await taskService.deleteTask(selectedTask.id);
      await loadTasks(); // Reload tasks
      setShowDeleteModal(false);
      setSelectedTask(null);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: Task['status']) => {
    try {
      await taskService.updateStatus(taskId, newStatus);
      await loadTasks(); // Reload tasks
    } catch (err) {
      console.error('Failed to update task status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task status');
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      type: task.type,
      priority: task.priority,
      status: task.status,
      due_date: task.due_date,
      related_to: task.related_to,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const pendingTasks = filteredTasks.filter(task => task.status === 'Open');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'In Progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'Completed' || task.status === 'Closed');
  const overdueTasks = filteredTasks.filter(task => isOverdue(task.due_date, task.status));

  const urgentTasks = filteredTasks.filter(task => task.priority === 'Urgent');
  const highTasks = filteredTasks.filter(task => task.priority === 'High');
  const mediumTasks = filteredTasks.filter(task => task.priority === 'Medium');
  const lowTasks = filteredTasks.filter(task => task.priority === 'Low');

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div className={`bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300 ${
      isOverdue(task.due_date, task.status) ? 'border-l-4 border-l-red-500' : 'border-gray-100'
    } ${task.status === 'Completed' || task.status === 'Closed' ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="mt-1">
            {getStatusIcon(task.status)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getTypeIcon(task.type)}
              <h4 className={`font-semibold text-gray-900 ${task.status === 'Completed' || task.status === 'Closed' ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <p className={`text-gray-600 mb-3 text-sm ${task.status === 'Completed' || task.status === 'Closed' ? 'line-through text-gray-400' : ''}`}>
              {task.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span className={isOverdue(task.due_date, task.status) ? 'text-red-600 font-medium' : ''}>
                  {new Date(task.due_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <User size={12} />
                <span>{task.assignee?.name || 'Unassigned'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Type: {task.type}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {task.status === 'Open' && (
            <button
              onClick={() => handleStatusChange(task.id, 'In Progress')}
              className="text-blue-600 hover:text-blue-700 text-xs font-medium px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              Start
            </button>
          )}
          {task.status === 'In Progress' && (
            <button
              onClick={() => handleStatusChange(task.id, 'Completed')}
              className="text-green-600 hover:text-green-700 text-xs font-medium px-2 py-1 rounded-md hover:bg-green-50 transition-colors"
            >
              Complete
            </button>
          )}
          {(task.status === 'Completed' || task.status === 'Closed') && (
            <button
              onClick={() => handleStatusChange(task.id, 'Open')}
              className="text-gray-600 hover:text-gray-700 text-xs font-medium px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
            >
              Reopen
            </button>
          )}
          <button
            onClick={() => openEditModal(task)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => openDeleteModal(task)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const ColumnView: React.FC<{ title: string; tasks: Task[]; color: string; icon: React.ReactNode }> = ({ title, tasks, color, icon }) => (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading tasks</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadTasks}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (viewMode) {
      case 'status':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ColumnView
              title="Open"
              tasks={pendingTasks}
              color="bg-gray-100 text-gray-800"
              icon={<Circle size={20} className="text-gray-600" />}
            />
            <ColumnView
              title="In Progress"
              tasks={inProgressTasks}
              color="bg-blue-100 text-blue-800"
              icon={<Clock size={20} className="text-blue-600" />}
            />
            <ColumnView
              title="Completed"
              tasks={completedTasks}
              color="bg-green-100 text-green-800"
              icon={<CheckCircle2 size={20} className="text-green-600" />}
            />
          </div>
        );
      case 'priority':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <ColumnView
              title="Urgent"
              tasks={urgentTasks}
              color="bg-red-100 text-red-800"
              icon={<AlertCircle size={20} className="text-red-600" />}
            />
            <ColumnView
              title="High"
              tasks={highTasks}
              color="bg-orange-100 text-orange-800"
              icon={<AlertCircle size={20} className="text-orange-600" />}
            />
            <ColumnView
              title="Medium"
              tasks={mediumTasks}
              color="bg-yellow-100 text-yellow-800"
              icon={<AlertCircle size={20} className="text-yellow-600" />}
            />
            <ColumnView
              title="Low"
              tasks={lowTasks}
              color="bg-green-100 text-green-800"
              icon={<AlertCircle size={20} className="text-green-600" />}
            />
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className={`bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow ${
                isOverdue(task.due_date, task.status) ? 'border-l-4 border-l-red-500' : 'border-gray-100'
              } ${task.status === 'Completed' || task.status === 'Closed' ? 'opacity-75' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getTypeIcon(task.type)}
                        <h4 className={`font-semibold text-gray-900 ${task.status === 'Completed' || task.status === 'Closed' ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className={`text-gray-600 mb-3 ${task.status === 'Completed' || task.status === 'Closed' ? 'line-through text-gray-400' : ''}`}>
                        {task.description}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span className={isOverdue(task.due_date, task.status) ? 'text-red-600 font-medium' : ''}>
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User size={14} />
                          <span>{task.assignee?.name || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Type: {task.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Related to: {task.related_to}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.status === 'Open' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'In Progress')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        Start
                      </button>
                    )}
                    {task.status === 'In Progress' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'Completed')}
                        className="text-green-600 hover:text-green-700 text-sm font-medium px-3 py-1 rounded-md hover:bg-green-50 transition-colors"
                      >
                        Complete
                      </button>
                    )}
                    {(task.status === 'Completed' || task.status === 'Closed') && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'Open')}
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium px-3 py-1 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Reopen
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(task)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Tasks & Reminders</h3>
          <p className="text-sm text-gray-600">Manage your tasks and stay on top of important activities</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Mode Selector */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid size={16} />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('status')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                viewMode === 'status' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Columns size={16} />
              <span>Status</span>
            </button>
            <button
              onClick={() => setViewMode('priority')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                viewMode === 'priority' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter size={16} />
              <span>Priority</span>
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
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{filteredTasks.length}</p>
            </div>
            <div className="bg-gray-500 rounded-lg p-3">
              <FileText size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tasks</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{pendingTasks.length + inProgressTasks.length}</p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3">
              <Clock size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{completedTasks.length}</p>
            </div>
            <div className="bg-green-500 rounded-lg p-3">
              <CheckCircle2 size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{overdueTasks.length}</p>
            </div>
            <div className="bg-red-500 rounded-lg p-3">
              <AlertCircle size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Content */}
      {renderContent()}

      {filteredTasks.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <CheckCircle2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600">Try adjusting your search terms or add a new task.</p>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
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
                  placeholder="Enter task title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Report">Report</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Related To</label>
                <input
                  type="text"
                  value={formData.related_to}
                  onChange={(e) => setFormData({ ...formData, related_to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter related company or contact"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                disabled={!formData.title || !formData.due_date}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Task</h3>
              <button
                onClick={() => setShowEditModal(false)}
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
                  placeholder="Enter task title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Report">Report</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Related To</label>
                <input
                  type="text"
                  value={formData.related_to}
                  onChange={(e) => setFormData({ ...formData, related_to: e.target.value })}
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
                onClick={handleEditTask}
                disabled={!formData.title || !formData.due_date}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{selectedTask.title}</strong>? 
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
                onClick={handleDeleteTask}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;