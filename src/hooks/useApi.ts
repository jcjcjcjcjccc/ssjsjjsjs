import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '../services/api';

// Generic hook for API calls
export interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
) {
  const { immediate = false, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        
        onSuccess?.(response.data);
      } else {
        const errorMessage = response.message || 'An error occurred';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      
      onError?.(errorMessage);
    }
  }, [apiCall, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook for paginated API calls
export interface UsePaginatedApiOptions<T> extends UseApiOptions<T[]> {
  initialPage?: number;
  initialLimit?: number;
}

export interface UsePaginatedApiState<T> extends UseApiState<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number) => Promise<any>,
  options: UsePaginatedApiOptions<T> = {}
) {
  const { immediate = false, initialPage = 1, initialLimit = 20, onSuccess, onError } = options;
  
  const [state, setState] = useState<UsePaginatedApiState<T>>({
    data: null,
    loading: false,
    error: null,
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const execute = useCallback(async (page?: number, limit?: number) => {
    const currentPage = page ?? state.page;
    const currentLimit = limit ?? state.limit;
    
    setState(prev => ({ ...prev, loading: true, error: null, page: currentPage, limit: currentLimit }));
    
    try {
      const response = await apiCall(currentPage, currentLimit);
      
      if (response.success && response.data) {
        const pagination = response.pagination || {
          page: currentPage,
          limit: currentLimit,
          total: response.data.length,
          totalPages: 1,
        };
        
        setState({
          data: response.data,
          loading: false,
          error: null,
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: pagination.totalPages,
          hasNextPage: pagination.page < pagination.totalPages,
          hasPrevPage: pagination.page > 1,
        });
        
        onSuccess?.(response.data);
      } else {
        const errorMessage = response.message || 'An error occurred';
        setState(prev => ({
          ...prev,
          data: null,
          loading: false,
          error: errorMessage,
        }));
        
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({
        ...prev,
        data: null,
        loading: false,
        error: errorMessage,
      }));
      
      onError?.(errorMessage);
    }
  }, [apiCall, state.page, state.limit, onSuccess, onError]);

  const nextPage = useCallback(() => {
    if (state.hasNextPage) {
      execute(state.page + 1);
    }
  }, [execute, state.hasNextPage, state.page]);

  const prevPage = useCallback(() => {
    if (state.hasPrevPage) {
      execute(state.page - 1);
    }
  }, [execute, state.hasPrevPage, state.page]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      execute(page);
    }
  }, [execute, state.totalPages]);

  const changeLimit = useCallback((limit: number) => {
    execute(1, limit);
  }, [execute]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      page: initialPage,
      limit: initialLimit,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    });
  }, [initialPage, initialLimit]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    reset,
  };
}

// Hook for mutations (create, update, delete)
export interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: string, variables: TVariables) => void;
}

export function useMutation<TData, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: UseMutationOptions<TData, TVariables> = {}
) {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (variables: TVariables) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await mutationFn(variables);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        
        onSuccess?.(response.data, variables);
        return response.data;
      } else {
        const errorMessage = response.message || 'An error occurred';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        
        onError?.(errorMessage, variables);
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      
      onError?.(errorMessage, variables);
      throw error;
    }
  }, [mutationFn, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}