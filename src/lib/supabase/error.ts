export class SupabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export class AuthError extends SupabaseError {
  constructor(message: string, code: string, details?: any) {
    super(message, code, details);
    this.name = 'AuthError';
  }
}

export class StorageError extends SupabaseError {
  constructor(message: string, code: string, details?: any) {
    super(message, code, details);
    this.name = 'StorageError';
  }
}

export function handleError(error: any): never {
  if (error?.code?.startsWith('auth/')) {
    throw new AuthError(error.message, error.code, error.details);
  }
  if (error?.code?.startsWith('storage/')) {
    throw new StorageError(error.message, error.code, error.details);
  }
  throw new SupabaseError(
    error.message || 'An unknown error occurred',
    error.code || 'unknown',
    error.details
  );
}