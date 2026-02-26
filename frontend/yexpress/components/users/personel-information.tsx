"use client"

import { User } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PersonalInformationProps {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  onFieldChange?: (field: string, value: string) => void
}

export function PersonalInformation({
  firstName = "",
  lastName = "",
  email = "",
  phone = "",
  onFieldChange
}: PersonalInformationProps) {
  
  const [formData, setFormData] = useState({
    firstName,
    lastName,
    email,
    phone
  })

  useEffect(() => {
    setFormData({ firstName, lastName, email, phone });
  }, [firstName, lastName, email, phone]);

  const [editingField, setEditingField] = useState<string | null>(null)

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    onFieldChange?.(field, value)
  }

  const EditableField = ({ 
    field, 
    label, 
    value, 
    type = "text",
    disabled = false
  }: { 
    field: string
    label: string
    value: string
    type?: string
    disabled?: boolean
  }) => {
    const isFieldEditing = editingField === field

    return (
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </Label>
        
        {isFieldEditing && !disabled ? (
          <Input
            type={type}
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={() => setEditingField(null)}
            autoFocus
            className="bg-background border-orange-200 focus-visible:ring-orange-500"
          />
        ) : (
          <div
            onClick={() => !disabled && setEditingField(field)}
            className={`px-4 py-2.5 rounded-lg border border-border transition-all duration-200 text-sm
              ${disabled 
                ? "bg-slate-100 dark:bg-slate-900 cursor-not-allowed text-muted-foreground" 
                : "bg-muted/50 cursor-pointer hover:bg-background hover:border-orange-300 hover:shadow-sm text-foreground"
              }`}
          >
            {value || <span className="text-muted-foreground italic">Add {label.toLowerCase()}...</span>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          Click on a field to edit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EditableField field="firstName" label="First Name" value={formData.firstName} />
        <EditableField field="lastName" label="Last Name" value={formData.lastName} />
        {/* Email is usually read-only in profile updates for security, pass disabled if needed */}
        <EditableField field="email" label="Email Address" value={formData.email} type="email" disabled={true} />
        <EditableField field="phone" label="Phone Number" value={formData.phone} type="tel" />
      </div>
    </div>
  )
}