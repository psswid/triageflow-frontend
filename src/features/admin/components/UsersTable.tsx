import { useAdminUsers } from '../hooks/useAdminUsers';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ImpersonateButton } from './ImpersonateButton';
import type { UserResource } from '../../../api/types';

const SYSTEM_USER_EMAIL = 'system@triageflow.local';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function roleBadgeClasses(role: string): string {
  if (role === 'ROLE_ADMIN') {
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
  }
  return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
}

export function UsersTable() {
  const { data: users, isLoading, error } = useAdminUsers();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load users"
        description="Could not fetch the user list. Please try again."
      />
    );
  }

  const filteredUsers: readonly UserResource[] =
    users?.filter((u) => u.attributes.email !== SYSTEM_USER_EMAIL) ?? [];

  if (filteredUsers.length === 0) {
    return (
      <EmptyState
        title="No users found"
        description="There are no users to display."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Roles
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {user.attributes.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {user.attributes.roles.map((role) => (
                    <span
                      key={role}
                      className={
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' +
                        roleBadgeClasses(role)
                      }
                    >
                      {role.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(user.attributes.createdAt)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <ImpersonateButton
                  userId={user.id}
                  userEmail={user.attributes.email}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
