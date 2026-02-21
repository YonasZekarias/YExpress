"use client"

import { User } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface PersonalInformationProps {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  onFieldChange?: (field: string, value: string) => void
}

export function PersonalInformation({
  firstName = "John",
  lastName = "Doe",
  email = "johndoe@astu.edu",
  phone = "+251 91 234 5678",
  onFieldChange
}: PersonalInformationProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName,
    lastName,
    email,
    phone
  })
  const [editingField, setEditingField] = useState<string | null>(null)

  const handleFieldClick = (field: string) => {
    setEditingField(field)
    setIsEditing(true)
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    onFieldChange?.(field, value)
  }

  const handleFieldBlur = (field: string) => {
    const wasEditingThisField = editingField === field
    setEditingField(null)
    if (wasEditingThisField) {
      setIsEditing(false)
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    setEditingField(null)
    
  }

  const handleCancel = () => {
    setFormData({ firstName, lastName, email, phone })
    setIsEditing(false)
    setEditingField(null)
  }

  const EditableField = ({ 
    field, 
    label, 
    value, 
    type = "text" 
  }: { 
    field: string
    label: string
    value: string
    type?: string
  }) => {
    const isFieldEditing = editingField === field

    return (
      <div>
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          {label}
        </label>
        {isFieldEditing ? (
          <Input
            type={type}
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFieldBlur(field)
              } else if (e.key === "Escape") {
                setFormData(prev => ({ ...prev, [field]: field === "firstName" ? firstName : field === "lastName" ? lastName : field === "email" ? email : phone }))
                handleFieldBlur(field)
              }
            }}
            autoFocus
            className="px-4 py-3 bg-muted rounded-lg border border-border text-foreground"
          />
        ) : (
          <div
            onClick={() => handleFieldClick(field)}
            className="px-4 py-3 bg-muted rounded-lg border border-border cursor-pointer hover:bg-muted/80 transition-colors"
          >
            <span className="text-muted-foreground">
              {value || `Enter ${label.toLowerCase()}`}
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <>
              <button
                onClick={handleSave}
                className="text-[#22c55e] hover:text-[#16a34a] font-medium"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="text-[#ef4444] hover:text-[#dc2626] font-medium"
              >
                Cancel
              </button>
            </>
          )}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-[#f48c25] hover:text-[#16a34a] font-medium"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EditableField field="firstName" label="First Name" value={formData.firstName} />
        <EditableField field="lastName" label="Last Name" value={formData.lastName} />
        <EditableField field="email" label="Email Address" value={formData.email} type="email" />
        <EditableField field="phone" label="Phone Number" value={formData.phone} type="tel" />
      </div>
    </div>
  )
}
