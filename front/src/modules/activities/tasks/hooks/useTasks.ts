import { DateTime } from 'luxon';

import { Activity } from '@/activities/types/Activity';
import { ActivityTargetableEntity } from '@/activities/types/ActivityTargetableEntity';
import { useFindManyObjectRecords } from '@/object-record/hooks/useFindManyObjectRecords';
import { useFilter } from '@/ui/object/object-filter-dropdown/hooks/useFilter';
import { parseDate } from '~/utils/date-utils';

export const useTasks = (entity?: ActivityTargetableEntity) => {
  const { selectedFilter } = useFilter();

  const { objects: activityTargets } = useFindManyObjectRecords({
    objectNamePlural: 'activityTargets',
    filter: {
      [entity?.type === 'Company' ? 'companyId' : 'personId']: {
        eq: entity?.id,
      },
    },
  });

  const { objects: completeTasksData } = useFindManyObjectRecords({
    objectNamePlural: 'activities',
    skip: !entity && !selectedFilter,
    filter: {
      completedAt: { is: 'NOT_NULL' },
      id: {
        in: activityTargets?.map((activityTarget) => activityTarget.activityId),
      },
      type: { eq: 'Task' },
    },
    orderBy: {
      createdAt: 'DescNullsFirst',
    },
  });

  const { objects: incompleteTaskData } = useFindManyObjectRecords({
    objectNamePlural: 'activities',
    skip: !entity && !selectedFilter,
    filter: {
      completedAt: { is: 'NULL' },
      id: {
        in: activityTargets?.map((activityTarget) => activityTarget.activityId),
      },
      type: { eq: 'Task' },
    },
    orderBy: {
      createdAt: 'DescNullsFirst',
    },
  });

  const todayOrPreviousTasks = incompleteTaskData?.filter((task) => {
    if (!task.dueAt) {
      return false;
    }
    const dueDate = parseDate(task.dueAt).toJSDate();
    const today = DateTime.now().endOf('day').toJSDate();
    return dueDate <= today;
  });

  const upcomingTasks = incompleteTaskData?.filter((task) => {
    if (!task.dueAt) {
      return false;
    }
    const dueDate = parseDate(task.dueAt).toJSDate();
    const today = DateTime.now().endOf('day').toJSDate();
    return dueDate > today;
  });

  const unscheduledTasks = incompleteTaskData?.filter((task) => {
    return !task.dueAt;
  });

  const completedTasks = completeTasksData;

  return {
    todayOrPreviousTasks: (todayOrPreviousTasks ?? []) as Activity[],
    upcomingTasks: (upcomingTasks ?? []) as Activity[],
    unscheduledTasks: (unscheduledTasks ?? []) as Activity[],
    completedTasks: (completedTasks ?? []) as Activity[],
  };
};
