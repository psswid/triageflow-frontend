import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Toast } from './Toast';

interface ToastItem {
  readonly id: string;
  readonly message: string;
  readonly variant: 'error' | 'warning' | 'info';
}

interface ToastContextValue {
  readonly toast: {
    readonly error: (message: string) => void;
    readonly warning: (message: string) => void;
    readonly info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastIdCounter = 0;

export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [toasts, setToasts] = useState<readonly ToastItem[]>([]);

  const addToast = useCallback((message: string, variant: ToastItem['variant']) => {
    const id = `toast-${++toastIdCounter}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    error: useCallback((message: string) => addToast(message, 'error'), [addToast]),
    warning: useCallback((message: string) => addToast(message, 'warning'), [addToast]),
    info: useCallback((message: string) => addToast(message, 'info'), [addToast]),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <Toast key={t.id} id={t.id} message={t.message} variant={t.variant} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
