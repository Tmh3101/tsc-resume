import { BasicFieldType } from "@/types/resume";
import { ResumeTemplate } from "@/types/template";

export const DEFAULT_FIELD_ORDER: BasicFieldType[] = [
  { id: "1", key: "name", label: "Họ và tên", type: "text", visible: true },

  { id: "2", key: "title", label: "Vị trí", type: "text", visible: true },
  {
    id: "3",
    key: "employementStatus",
    label: "Trạng thái",
    type: "text",
    visible: true
  },
  { id: "4", key: "birthDate", label: "Ngày sinh", type: "date", visible: true },
  { id: "5", key: "email", label: "Email", type: "text", visible: true },
  { id: "6", key: "phone", label: "Điện thoại", type: "text", visible: true },
  { id: "7", key: "location", label: "Địa chỉ", type: "text", visible: true }
];
