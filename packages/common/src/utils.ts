// Общие утилиты для проекта

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}ч ${remainingMinutes}м ${remainingSeconds}с`;
  }

  if (minutes > 0) {
    return `${minutes}м ${remainingSeconds}с`;
  }

  return `${seconds}с`;
};