"use client";
import { useLocale } from "@/lib/i18n/client";
import { Button, Field, Input } from "@/components/ui";
import { setupCopy } from "./copy";
import { MAX_SIBLINGS, type SetupErrors, type SiblingDraft } from "./setup-draft";

export interface SiblingsFieldsProps {
  siblings: readonly SiblingDraft[];
  errors: SetupErrors;
  onChange: (siblings: SiblingDraft[]) => void;
}

const NAME_EXAMPLES = ["Mike", "Emily", "James", "Anna", "David", "Grace", "Tom", "Lucy"] as const;

export function SiblingsFields({ siblings, errors, onChange }: SiblingsFieldsProps) {
  const { locale } = useLocale();
  const c = setupCopy(locale);
  const t = c.setup;
  const message = (key: string): string | undefined => (errors[key] ? c.errors[errors[key]] : undefined);
  function update(index: number, patch: Partial<SiblingDraft>): void {
    onChange(siblings.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }
  function remove(index: number): void {
    onChange(siblings.filter((_, i) => i !== index));
  }
  function add(): void {
    onChange([...siblings, { name: "", email: "" }]);
  }

  return (
    <div className="flex flex-col gap-4">
      {siblings.map((sibling, i) => (
        <div key={i} className="grid items-start gap-3 sm:grid-cols-[1fr_1.3fr_auto]">
          <Field label={t.sibling({ n: i + 1 })} error={message(`sibling.${i}.name`)}>
            {(p) => (
              <Input
                {...p}
                value={sibling.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder={NAME_EXAMPLES[i % NAME_EXAMPLES.length]}
                autoComplete="off"
                maxLength={60}
              />
            )}
          </Field>
          <Field
            label={t.email}
            optional
            optionalLabel={c.fields.optional}
            error={message(`sibling.${i}.email`)}
          >
            {(p) => (
              <Input
                {...p}
                type="email"
                value={sibling.email}
                onChange={(e) => update(i, { email: e.target.value })}
                placeholder={`${NAME_EXAMPLES[i % NAME_EXAMPLES.length].toLowerCase()}@example.com`}
                autoComplete="off"
              />
            )}
          </Field>
          {siblings.length > 1 && (
            <Button variant="ghost" size="sm" className="sm:mt-7" onClick={() => remove(i)}>
              {t.remove}
              <span className="sr-only">{t.removeSr({ n: i + 1 })}</span>
            </Button>
          )}
        </div>
      ))}
      {errors.siblings && <p className="text-xs text-danger">{c.errors[errors.siblings]}</p>}
      {siblings.length < MAX_SIBLINGS && (
        <div>
          <Button variant="secondary" size="sm" onClick={add}>
            {t.addSibling}
          </Button>
        </div>
      )}
    </div>
  );
}
