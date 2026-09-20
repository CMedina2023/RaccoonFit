import { getWeeklyWorkoutDayForDate, getWeeklyWorkoutSchedule, isValidWeeklyRoutine } from '../src/core/weeklyWorkoutPlanner';

describe('Semanario de entrenamiento', () => {
  it('protege al principiante con tres sesiones no consecutivas', () => {
    const schedule = getWeeklyWorkoutSchedule(1);
    expect(schedule.filter((day) => day.status === 'training')).toHaveLength(3);
    expect(schedule.filter((day) => day.focus === 'full_body')).toHaveLength(3);
  });
  it('separa los grupos musculares definidos para nivel intermedio', () => {
    const focuses = getWeeklyWorkoutSchedule(2).map((day) => day.focus);
    expect(focuses).toEqual(['chest_back', 'legs_glutes', 'rest', 'biceps_triceps', 'core_cardio', 'shoulders_traps', 'rest']);
  });
  it('usa la sugerencia inicial con al menos dos descansos semanales', () => {
    ([1, 2, 3] as const).forEach((level) => expect(isValidWeeklyRoutine({ days: getWeeklyWorkoutSchedule(level) })).toBe(true));
  });
  it('permite que el usuario distribuya los descansos y grupos sin bloquear días consecutivos', () => {
    const days = getWeeklyWorkoutSchedule(2);
    days[0] = { ...days[0], focus: 'legs_glutes', label: 'Pierna y glúteo' };
    days[1] = { ...days[1], focus: 'legs_glutes', label: 'Pierna y glúteo' };

    expect(isValidWeeklyRoutine({ days })).toBe(true);
  });
  it('rechaza guardar menos de dos descansos semanales', () => {
    const days = getWeeklyWorkoutSchedule(2).map((day) => day.focus === 'rest'
      ? { ...day, focus: 'full_body' as const, status: 'training' as const, label: 'Cuerpo completo' }
      : day);

    expect(isValidWeeklyRoutine({ days })).toBe(false);
  });
  it('elige la tarjeta que corresponde al día local de la semana', () => {
    const schedule = getWeeklyWorkoutSchedule(2);

    expect(getWeeklyWorkoutDayForDate(schedule, new Date(2026, 8, 14, 12)).day).toBe('Lun');
    expect(getWeeklyWorkoutDayForDate(schedule, new Date(2026, 8, 20, 12)).day).toBe('Dom');
    expect(getWeeklyWorkoutDayForDate(schedule, new Date(2026, 8, 16, 12)).focus).toBe('rest');
  });
});
