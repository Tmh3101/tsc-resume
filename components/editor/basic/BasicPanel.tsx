"use client";
import React, { useState } from "react";
import { PlusCircle, GripVertical, Trash2, Eye, EyeOff } from "lucide-react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import PhotoUpload from "@/components/shared/PhotoSelector";
import IconSelector from "../IconSelector";
import AlignSelector from "./AlignSelector";
import Field from "../Field";
import { cn } from "@/lib/utils";
import { DEFAULT_FIELD_ORDER } from "@/config";
import { useResumeStore } from "@/store/useResumeStore";
import { BasicFieldType, CustomFieldType } from "@/types/resume";
import { generateUUID } from "@/lib/utils";
interface CustomFieldProps {
  field: CustomFieldType;
  onUpdate: (field: CustomFieldType) => void;
  onDelete: (id: string) => void;
}

const itemAnimations = {
  initial: { opacity: 0, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 0 },
  transition: { type: "spring" as const, stiffness: 500, damping: 50, mass: 1 },
};

const CustomField: React.FC<CustomFieldProps> = ({
  field,
  onUpdate,
  onDelete,
}) => {
  return (
    <Reorder.Item
      value={field}
      id={field.id}
      className="group touch-none list-none"
    >
      <motion.div
        {...itemAnimations}
        className={cn(
          "flex items-center gap-2 py-1.5",
          "bg-white dark:bg-neutral-900",
          "rounded-lg",
          "transition-all duration-200",
          !field.visible && "opacity-50"
        )}
      >
        <div className="shrink-0">
          <GripVertical
            className={cn(
              "w-4 h-4 cursor-grab active:cursor-grabbing",
              "text-gray-300 dark:text-neutral-600",
              "hover:text-gray-500 dark:hover:text-neutral-400",
              "transition-colors duration-200"
            )}
          />
        </div>
        <IconSelector
          value={field.icon}
          onChange={(value) => onUpdate({ ...field, icon: value })}
        />
        <div className="flex-1">
          <Field
            value={field.value}
            onChange={(value) =>
              onUpdate({
                ...field,
                value: value,
              })
            }
            placeholder="Nhập giá trị"
          />
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "shrink-0 h-7 w-7 p-0",
              "text-gray-400 dark:text-neutral-500",
              "hover:text-gray-600 dark:hover:text-neutral-300 hover:bg-transparent"
            )}
            onClick={() => onUpdate({ ...field, visible: !field.visible })}
          >
            {field.visible ? (
              <Eye className="w-3.5 h-3.5 text-orange" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(field.id)}
            className={cn(
              "shrink-0 h-7 w-7 p-0",
              "text-gray-400 dark:text-neutral-500",
              "hover:text-red-500 dark:hover:text-red-400 hover:bg-transparent"
            )}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.div>
    </Reorder.Item>
  );
};

const BasicPanel: React.FC = () => {
  const { activeResume, updateBasicInfo } = useResumeStore();
  const { basic } = activeResume || {};
  const [customFields, setCustomFields] = useState<CustomFieldType[]>(
    basic?.customFields?.map((field) => ({
      ...field,
      visible: field.visible ?? true,
    })) || []
  );
  const [basicFields, setBasicFields] = useState<BasicFieldType[]>(() => {
    if (!basic?.fieldOrder) {
      return DEFAULT_FIELD_ORDER;
    }
    return basic.fieldOrder.map((field) => ({
      ...field,
      visible: field.visible ?? true,
    }));
  });

  const handleBasicReorder = (newOrder: BasicFieldType[]) => {
    setBasicFields(newOrder);
    updateBasicInfo({
      ...basic,
      fieldOrder: newOrder,
    });
  };

  const toggleFieldVisibility = (fieldId: string, isVisible: boolean) => {
    const newFields = basicFields.map((field) =>
      field.id === fieldId ? { ...field, visible: isVisible } : field
    );
    setBasicFields(newFields);
    updateBasicInfo({
      ...basic,
      fieldOrder: newFields,
    });
  };

  const deleteBasicField = (fieldId: string) => {
    const fieldToDelete = basicFields.find((field) => field.id === fieldId);
    if (
      fieldToDelete &&
      (fieldToDelete.key === "name" || fieldToDelete.key === "title")
    ) {
      return;
    }

    const updatedFields = basicFields.filter((field) => field.id !== fieldId);
    setBasicFields(updatedFields);
    updateBasicInfo({
      ...basic,
      fieldOrder: updatedFields,
    });
  };

  const addCustomField = () => {
    const fieldToAdd: CustomFieldType = {
      id: generateUUID(),
      label: "",
      value: "",
      icon: "User",
      visible: true,
    };
    const updatedFields = [...customFields, fieldToAdd];
    setCustomFields(updatedFields);
    updateBasicInfo({
      ...basic,
      customFields: updatedFields,
    });
  };

  const updateCustomField = (updatedField: CustomFieldType) => {
    const updatedFields = customFields.map((field) =>
      field.id === updatedField.id ? updatedField : field
    );
    setCustomFields(updatedFields);
    updateBasicInfo({
      ...basic,
      customFields: updatedFields,
    });
  };

  const deleteCustomField = (id: string) => {
    const updatedFields = customFields.filter((field) => field.id !== id);
    setCustomFields(updatedFields);
    updateBasicInfo({
      ...basic,
      customFields: updatedFields,
    });
  };

  const handleCustomFieldsReorder = (newOrder: CustomFieldType[]) => {
    setCustomFields(newOrder);
    updateBasicInfo({
      ...basic,
      customFields: newOrder,
    });
  };

  const renderBasicField = (field: BasicFieldType) => {
    const selectedIcon = basic?.icons?.[field.key] || "User";
    const isNameOrTitle = field.key === "name" || field.key === "title";
    // Bỏ qua trường "Trạng thái"
    if (field.key === "employementStatus") return null;

    return (
      <Reorder.Item
        value={field}
        id={field.id}
        key={field.id}
        className="group touch-none list-none"
        dragListener={!isNameOrTitle}
      >
        <motion.div
          {...itemAnimations}
          className={cn(
            "flex items-center gap-2 py-1.5",
            "bg-white dark:bg-neutral-900",
            "rounded-lg",
            "transition-all duration-200",
            !field.visible && "opacity-50"
          )}
        >
          {!isNameOrTitle && (
            <div className="shrink-0">
              <GripVertical
                className={cn(
                  "w-4 h-4 cursor-grab active:cursor-grabbing",
                  "text-gray-300 dark:text-neutral-600",
                  "hover:text-gray-500 dark:hover:text-neutral-400",
                  "transition-colors duration-200"
                )}
              />
            </div>
          )}

          <div className="flex flex-1 min-w-0 items-center gap-2">
            {!isNameOrTitle && (
              <IconSelector
                value={selectedIcon}
                onChange={(value) => {
                  updateBasicInfo({
                    ...basic,
                    icons: {
                      ...(basic?.icons || {}),
                      [field.key]: value,
                    },
                  });
                }}
              />
            )}
            {isNameOrTitle && (
              <div className="w-[70px] text-xs font-medium text-gray-500 dark:text-neutral-400">
                {field.label}
              </div>
            )}
            <div className="flex-1">
              <Field
                label=""
                value={(basic?.[field.key] as string) ?? ""}
                onChange={(value) =>
                  updateBasicInfo({
                    ...basic,
                    [field.key]: value,
                  })
                }
                placeholder={isNameOrTitle ? `Nhập ${field.label.toLowerCase()}` : field.label}
                type={field.type}
              />
            </div>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "shrink-0 h-7 w-7 p-0",
                "text-gray-400 dark:text-neutral-500",
                "hover:text-gray-600 dark:hover:text-neutral-300 hover:bg-transparent"
              )}
              onClick={() => toggleFieldVisibility(field.id, !field.visible)}
            >
              {field.visible ? (
                <Eye className="w-3.5 h-3.5 text-orange" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
            </Button>

            {!isNameOrTitle && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "shrink-0 h-7 w-7 p-0",
                  "text-gray-400 dark:text-neutral-500",
                  "hover:text-red-500 dark:hover:text-red-400 hover:bg-transparent"
                )}
                onClick={() => deleteBasicField(field.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </motion.div>
      </Reorder.Item>
    );
  };

  return (
    <div className="space-y-4 p-3">
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-700 dark:text-neutral-300">Bố cục</h2>
        <div className="bg-white dark:bg-neutral-900 rounded-lg">
          <AlignSelector
            value={basic?.layout || "left"}
            onChange={(value) =>
              updateBasicInfo({
                ...basic,
                layout: value,
              })
            }
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700 dark:text-neutral-300">Thông tin cơ bản</h2>
        </div>

        <div className="space-y-3">
          <motion.div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-3"
            >
              <PhotoUpload />
            </motion.div>

            <motion.div className="space-y-4">
              <motion.div className="space-y-1">
                <AnimatePresence mode="popLayout">
                  <Reorder.Group
                    axis="y"
                    as="div"
                    values={basicFields}
                    onReorder={handleBasicReorder}
                    className="space-y-0.5"
                  >
                    {basicFields.map((field) => renderBasicField(field))}
                  </Reorder.Group>
                </AnimatePresence>
              </motion.div>

              <motion.div className="space-y-1.5 pt-3 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <motion.h3 className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                    Trường tùy chỉnh
                  </motion.h3>
                  <Button 
                    onClick={addCustomField} 
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-orange hover:text-orange hover:bg-orange/10"
                  >
                    <PlusCircle className="w-3 h-3 mr-1" />
                    Thêm
                  </Button>
                </div>
                <AnimatePresence mode="popLayout">
                  <Reorder.Group
                    axis="y"
                    as="div"
                    values={customFields}
                    onReorder={handleCustomFieldsReorder}
                    className="space-y-0.5"
                  >
                    {Array.isArray(customFields) &&
                      customFields.map((field) => (
                        <CustomField
                          key={field.id}
                          field={field}
                          onUpdate={updateCustomField}
                          onDelete={deleteCustomField}
                        />
                      ))}
                  </Reorder.Group>
                </AnimatePresence>
              </motion.div>

              <motion.div className="space-y-2 pt-3 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <motion.h3 className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                    Github Contributions
                  </motion.h3>
                  <Switch
                    checked={basic?.githubContributionsVisible}
                    onCheckedChange={(checked) =>
                      updateBasicInfo({
                        ...basic,
                        githubContributionsVisible: checked,
                      })
                    }
                    className="data-[state=checked]:bg-orange"
                  />
                </div>

                {basic?.githubContributionsVisible && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-[70px] text-xs text-gray-500 dark:text-neutral-400">Token</div>
                      <Input
                        type="password"
                        placeholder="Nhập token"
                        className="flex-1 h-7 text-sm border-gray-200 dark:border-neutral-700 focus:border-orange focus:ring-orange/20"
                        value={basic?.githubKey}
                        onChange={(e) =>
                          updateBasicInfo({
                            ...basic,
                            githubKey: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-[70px] text-xs text-gray-500 dark:text-neutral-400">Username</div>
                      <Input
                        className="flex-1 h-7 text-sm border-gray-200 dark:border-neutral-700 focus:border-orange focus:ring-orange/20"
                        placeholder="Nhập username"
                        value={basic?.githubUseName}
                        onChange={(e) =>
                          updateBasicInfo({
                            ...basic,
                            githubUseName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BasicPanel;
