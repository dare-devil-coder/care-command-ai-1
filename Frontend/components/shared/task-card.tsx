import { Task } from '@/lib/mock-data';
import { mockUsers } from '@/lib/mock-data';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityColors = {
  critical: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
  high: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400',
  medium: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
  low: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
};

const statusColors = {
  pending: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  'in-progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
};

const typeIcons = {
  'check-vitals': '📊',
  medication: '💊',
  test: '🔬',
  consultation: '👨‍⚕️',
  'follow-up': '📋',
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const assignedUser = mockUsers[task.assignedTo];

  return (
    <div
      onClick={onClick}
      className={`task-${task.priority} glass p-4 cursor-pointer hover:shadow-lg hover:shadow-violet-300/20 dark:hover:shadow-violet-600/20 transition-all duration-200 group`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-2xl mt-0.5">{typeIcons[task.type]}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {task.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
              {task.description}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/20 dark:border-white/10">
        <div className="flex items-center gap-2">
          <img
            src={assignedUser?.avatar}
            alt={assignedUser?.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs text-slate-600 dark:text-slate-400">{assignedUser?.name.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600 dark:text-slate-400">{task.dueTime}</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
            {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
