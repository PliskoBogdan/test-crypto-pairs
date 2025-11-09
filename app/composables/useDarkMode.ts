export function useDarkMode() {
  const isDark = ref(false);

  const apply = (value: boolean) => {
    if (!import.meta.client) {
      return
    };

    if (value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", value ? "dark" : "light");
  };

  onMounted(() => {
    if (!import.meta.client) {
      return
    };

    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      isDark.value = true;
    } else if (saved === "light") {
      isDark.value = false;
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    apply(isDark.value);
  });

  watch(isDark, (val) => apply(val));

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  return {
    isDark,
    toggleTheme,
  };
}
