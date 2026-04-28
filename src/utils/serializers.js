export function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
}

export function serializeProject(project) {
  return {
    id: project.id,
    user_id: project.user_id,
    name: project.name,
    description: project.description,
    status: project.status,
    due_date: project.due_date,
    created_at: project.created_at,
  };
}

export function serializeLabel(label) {
  return {
    id: label.id,
    user_id: label.user_id,
    name: label.name,
    color: label.color,
    created_at: label.created_at,
  };
}

export function serializeTask(task) {
  return {
    id: task.id,
    project_id: task.project_id,
    assigned_user_id: task.assigned_user_id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    due_date: task.due_date,
    created_at: task.created_at,
    labels:
      task.task_labels?.map((taskLabel) => serializeLabel(taskLabel.label)) ?? [],
  };
}
