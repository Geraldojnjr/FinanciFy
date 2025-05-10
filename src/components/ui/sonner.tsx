
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      expand={false}
      closeButton
      richColors
      duration={5000}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-md group-[.toaster]:rounded-lg group-[.toaster]:p-3",
          title: "group-[.toast]:text-sm group-[.toast]:font-semibold group-[.toast]:tracking-tight",
          description: "group-[.toast]:text-xs group-[.toast]:opacity-90 group-[.toast]:mt-1",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md group-[.toast]:h-7 group-[.toast]:text-xs",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md group-[.toast]:h-7 group-[.toast]:text-xs",
          closeButton:
            "group-[.toast]:text-foreground/50 group-[.toast]:opacity-70 group-[.toast]:transition-opacity group-[.toast]:hover:opacity-100"
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
