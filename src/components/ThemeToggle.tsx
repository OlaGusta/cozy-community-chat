
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={(value) => {
        if (value) setTheme(value as "light" | "dark" | "system");
      }}
      className="grid grid-cols-3 gap-1"
    >
      <ToggleGroupItem value="light" aria-label="Light" className="px-3">
        <Sun className="h-5 w-5 mr-1" />
        <span>Light</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark" className="px-3">
        <Moon className="h-5 w-5 mr-1" />
        <span>Dark</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label="System" className="px-3">
        <Laptop className="h-5 w-5 mr-1" />
        <span>System</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function ThemeToggleSimple() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
