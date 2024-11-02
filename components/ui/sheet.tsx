// @/components/ui/sheet.tsx

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils"; // Utility for classnames (if you have one set up)

const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ className, children, ...props }, ref) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content
      ref={ref}
      className={cn(
        "fixed right-0 top-0 z-50 w-full max-w-md p-6 bg-white shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </Dialog.Content>
  </Dialog.Portal>
));
SheetContent.displayName = Dialog.Content.displayName;

export { Sheet, SheetTrigger, SheetClose, SheetContent };
