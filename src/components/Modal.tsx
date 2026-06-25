import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  modalTitle: string;
  children: ReactNode;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const Modal = ({ open, onClose, modalTitle, children }: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    previousActiveElement.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      const autofocusElement =
        panelRef.current?.querySelector<HTMLElement>("[data-autofocus]");
      const firstFocusableElement =
        panelRef.current?.querySelector<HTMLElement>(focusableSelector);

      (autofocusElement ?? firstFocusableElement ?? panelRef.current)?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = originalOverflow;

      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    ).filter((element) => element.offsetParent !== null);

    if (focusableElements.length === 0) {
      event.preventDefault();
      panelRef.current?.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-modal="true"
      role="dialog"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="fixed inset-0 bg-paper-ink/50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            ref={panelRef}
            tabIndex={-1}
            className="relative transform overflow-hidden rounded-lg bg-paper-background text-left text-paper-ink shadow-xl outline -outline-offset-1 outline-paper-ink/15 transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div className="bg-paper-background px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-paper-ink/10 text-paper-ink sm:mx-0 sm:size-10">
                  <p aria-hidden="true">!</p>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 id={titleId} className="text-base font-semibold text-paper-ink">
                    {modalTitle}
                  </h3>
                  <div className="mt-2">
                    {children}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-paper-ink/5 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-paper-ink px-3 py-2 text-sm font-semibold text-paper-background inset-ring inset-ring-paper-ink/10 transition-colors hover:bg-paper-ink/85 sm:mt-0 sm:w-auto"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
