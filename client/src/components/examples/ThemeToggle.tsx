import ThemeToggle from '../ThemeToggle';

export default function ThemeToggleExample() {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Theme Toggle</h3>
      <p className="text-muted-foreground">Click to switch between light and dark modes</p>
      <ThemeToggle />
    </div>
  );
}