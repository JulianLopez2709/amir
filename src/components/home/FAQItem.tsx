
import { useState } from "react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Plus, Minus } from "lucide-react"

function FAQItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string
  answer: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <Collapsible open={open} onOpenChange={onToggle} className="border-b">
      <CollapsibleTrigger className="flex w-full items-center justify-between py-6 text-left">
        <span className="text-lg font-medium">{question}</span>
        {open ? (
          <Minus className="h-5 w-5" />
        ) : (
          <Plus className="h-5 w-5" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="pb-6 text-gray-600 max-w-2xl data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        {answer}
      </CollapsibleContent>
    </Collapsible>
  )
}


export default FAQItem
