export const getTaskStatus = (dateText: string) => {
  // Keep status simple for now based on date rules.
  if (!dateText.trim()) {
    return "inProgress";
  }

  const chosenDate = new Date(dateText);

  if (Number.isNaN(chosenDate.getTime())) {
    return "inProgress";
  }

  const now = new Date();
  const diffMs = chosenDate.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays > 7) {
    return "upComing";
  }

  return "inProgress";
};
