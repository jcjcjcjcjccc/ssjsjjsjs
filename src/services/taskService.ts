import { httpClient, ApiResponse, PaginatedResponse, apiUtils } from './api';
import { authService } from './authService';

// Task related types based on your API response
export interface Task {
  id: number;
  organisation_id: number;
  assignee_id: number;
  title: string;
  description: string;
  type: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Completed' | 'Closed';
  due_date: string;
  related_to: string;
  created_at: string;
  updated_at: string;
  assignee?: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    organisation_id: number;
  };
}

export interface CreateTaskData {
  title: string;
  description: string;
  type: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Completed' | 'Closed';
  due_date: string;
  related_to: string;
  assignee_id?: number;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export interface TaskFilters {
  status?: Task['status'];
  priority?: Task['priority'];
  type?: string;
  assignee_id?: number;
  search?: string;
  due_date_from?: string;
  due_date_to?: string;
}

export interface TaskStats {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  closed: number;
  overdue: number;
  dueToday: number;
  dueTomorrow: number;
  dueThisWeek: number;
  byPriority: Record<Task['priority'], number>;
  byType: Record<string, number>;
  completionRate: number;
}

// Task service class
class TaskService {
  /**
   * Get all tasks for current user
   */
  async getTasks(): Promise<Task[]> {
    try {
      const currentUser = authService.getStoredUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await httpClient.get<Task[]>(`/users/${currentUser.id}/tasks`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch tasks');
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  }

  /**
   * Get task by ID
   */
  async getTask(id: number): Promise<Task> {
    try {
      const response = await httpClient.get<Task>(`/tasks/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch task');
    } catch (error) {
      console.error('Get task error:', error);
      throw error;
    }
  }

  /**
   * Create new task
   */
  async createTask(taskData: CreateTaskData): Promise<Task> {
    try {
      const currentUser = authService.getStoredUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Add current user's organisation_id and assignee_id if not provided
      const payload = {
        ...taskData,
        organisation_id: currentUser.organisation_id,
        assignee_id: taskData.assignee_id || currentUser.id,
      };

      const response = await httpClient.post<Task>('/tasks', payload);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create task');
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  }

  /**
   * Update task
   */
  async updateTask(id: number, taskData: UpdateTaskData): Promise<Task> {
    try {
      const response = await httpClient.put<Task>(`/tasks/${id}`, taskData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update task');
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  }

  /**
   * Delete task
   */
  async deleteTask(id: number): Promise<void> {
    try {
      const response = await httpClient.delete(`/tasks/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  }

  /**
   * Update task status
   */
  async updateStatus(id: number, status: Task['status']): Promise<Task> {
    try {
      const response = await httpClient.put<Task>(`/tasks/${id}`, { status });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update task status');
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  }

  /**
   * Update task priority
   */
  async updatePriority(id: number, priority: Task['priority']): Promise<Task> {
    try {
      const response = await httpClient.put<Task>(`/tasks/${id}`, { priority });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update task priority');
    } catch (error) {
      console.error('Update priority error:', error);
      throw error;
    }
  }

  /**
   * Get task statistics (calculated from tasks)
   */
  async getTaskStats(): Promise<TaskStats> {
    try {
      const tasks = await this.getTasks();
      
      const stats: TaskStats = {
        total: tasks.length,
        open: tasks.filter(t => t.status === 'Open').length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        closed: tasks.filter(t => t.status === 'Closed').length,
        overdue: tasks.filter(t => new Date(t.due_date) < new Date() && t.status !== 'Completed' && t.status !== 'Closed').length,
        dueToday: tasks.filter(t => new Date(t.due_date).toDateString() === new Date().toDateString()).length,
        dueTomorrow: tasks.filter(t => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return new Date(t.due_date).toDateString() === tomorrow.toDateString();
        }).length,
        dueThisWeek: tasks.filter(t => {
          const weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          return new Date(t.due_date) <= weekFromNow && new Date(t.due_date) >= new Date();
        }).length,
        byPriority: {
          'Low': tasks.filter(t => t.priority === 'Low').length,
          'Medium': tasks.filter(t => t.priority === 'Medium').length,
          'High': tasks.filter(t => t.priority === 'High').length,
          'Urgent': tasks.filter(t => t.priority === 'Urgent').length,
        },
        byType: tasks.reduce((acc, task) => {
          acc[task.type] = (acc[task.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        completionRate: tasks.length > 0 ? (tasks.filter(t => t.status === 'Completed' || t.status === 'Closed').length / tasks.length) * 100 : 0,
      };
      
      return stats;
    } catch (error) {
      console.error('Get task stats error:', error);
      throw error;
    }
  }

  /**
   * Search tasks
   */
  async searchTasks(query: string): Promise<Task[]> {
    try {
      const tasks = await this.getTasks();
      
      return tasks.filter(task =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase()) ||
        task.type.toLowerCase().includes(query.toLowerCase()) ||
        task.related_to.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Search tasks error:', error);
      throw error;
    }
  }

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(): Promise<Task[]> {
    try {
      const tasks = await this.getTasks();
      const now = new Date();
      
      return tasks.filter(task => 
        new Date(task.due_date) < now && 
        task.status !== 'Completed' && 
        task.status !== 'Closed'
      );
    } catch (error) {
      console.error('Get overdue tasks error:', error);
      throw error;
    }
  }

  /**
   * Get tasks due today
   */
  async getTasksDueToday(): Promise<Task[]> {
    try {
      const tasks = await this.getTasks();
      const today = new Date().toDateString();
      
      return tasks.filter(task => 
        new Date(task.due_date).toDateString() === today
      );
    } catch (error) {
      console.error('Get tasks due today error:', error);
      throw error;
    }
  }

  /**
   * Get recent tasks
   */
  async getRecentTasks(limit: number = 5): Promise<Task[]> {
    try {
      const tasks = await this.getTasks();
      
      return tasks
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Get recent tasks error:', error);
      throw error;
    }
  }

  /**
   * Filter tasks
   */
  filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.type && task.type !== filters.type) return false;
      if (filters.assignee_id && task.assignee_id !== filters.assignee_id) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!task.title.toLowerCase().includes(searchLower) &&
            !task.description.toLowerCase().includes(searchLower) &&
            !task.type.toLowerCase().includes(searchLower) &&
            !task.related_to.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      if (filters.due_date_from && new Date(task.due_date) < new Date(filters.due_date_from)) return false;
      if (filters.due_date_to && new Date(task.due_date) > new Date(filters.due_date_to)) return false;
      
      return true;
    });
  }
}

// Create and export service instance
export const taskService = new TaskService();

// Export for convenience
export default taskService;