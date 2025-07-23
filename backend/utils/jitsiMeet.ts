export function generateJitsiMeetLink(): string {
  const random = () => Math.random().toString(36).substring(2, 8);
  return `https://meet.jit.si/${random()}-${random()}-${random()}`;
} 