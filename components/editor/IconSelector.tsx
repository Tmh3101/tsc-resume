import React from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  // Thông tin cá nhân
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Smartphone,
  // Học vấn
  GraduationCap,
  School,
  Book,
  Library,
  Award,
  // Kinh nghiệm làm việc
  Briefcase,
  Building2,
  Building,
  CalendarRange,
  Clock,
  // Kỹ năng
  Code,
  Cpu,
  Database,
  Terminal,
  Layers,
  // Ngôn ngữ
  Languages,
  MessageSquare,
  MessagesSquare,
  // Dự án
  FolderGit2,
  GitBranch,
  Rocket,
  Target,
  // Thành tựu và chứng chỉ
  Trophy,
  Medal,
  Star,
  // Sở thích
  Heart,
  Music,
  Palette,
  Camera,
  // Mạng xã hội
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  // Khác
  FileText,
  FileCheck,
  Filter,
  Link,
  Wallet,
  Lightbulb,
  Send,
  Share2,
  Settings,
  Search as SearchIcon,
  Flag,
  Bookmark,
  ThumbsUp,
  Zap,
} from "lucide-react";

interface IconOption {
  label: string;
  value: string;
  icon: React.ElementType;
  category: string;
}

interface IconSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const getIconOptions = (): IconOption[] => [
  // Thông tin cá nhân
  {
    label: "Người dùng",
    value: "User",
    icon: User,
    category: "Cá nhân",
  },
  {
    label: "Email",
    value: "Mail",
    icon: Mail,
    category: "Cá nhân",
  },
  {
    label: "Điện thoại",
    value: "Phone",
    icon: Phone,
    category: "Cá nhân",
  },
  {
    label: "Địa chỉ",
    value: "MapPin",
    icon: MapPin,
    category: "Cá nhân",
  },
  {
    label: "Website",
    value: "Globe",
    icon: Globe,
    category: "Cá nhân",
  },
  {
    label: "Di động",
    value: "Smartphone",
    icon: Smartphone,
    category: "Cá nhân",
  },

  // Học vấn
  {
    label: "Học vấn",
    value: "GraduationCap",
    icon: GraduationCap,
    category: "Học vấn",
  },
  {
    label: "Trường học",
    value: "School",
    icon: School,
    category: "Học vấn",
  },
  {
    label: "Chuyên ngành",
    value: "Book",
    icon: Book,
    category: "Học vấn",
  },
  {
    label: "Thư viện",
    value: "Library",
    icon: Library,
    category: "Học vấn",
  },
  {
    label: "Học bổng",
    value: "Award",
    icon: Award,
    category: "Học vấn",
  },

  // Kinh nghiệm làm việc
  {
    label: "Công việc",
    value: "Briefcase",
    icon: Briefcase,
    category: "Kinh nghiệm",
  },
  {
    label: "Công ty",
    value: "Building2",
    icon: Building2,
    category: "Kinh nghiệm",
  },
  {
    label: "Văn phòng",
    value: "Building",
    icon: Building,
    category: "Kinh nghiệm",
  },
  {
    label: "Khoảng thời gian",
    value: "CalendarRange",
    icon: CalendarRange,
    category: "Kinh nghiệm",
  },
  {
    label: "Thời gian làm việc",
    value: "Clock",
    icon: Clock,
    category: "Kinh nghiệm",
  },

  // Kỹ năng
  {
    label: "Lập trình",
    value: "Code",
    icon: Code,
    category: "Kỹ năng",
  },
  {
    label: "Hệ thống",
    value: "Cpu",
    icon: Cpu,
    category: "Kỹ năng",
  },
  {
    label: "Cơ sở dữ liệu",
    value: "Database",
    icon: Database,
    category: "Kỹ năng",
  },
  {
    label: "Terminal",
    value: "Terminal",
    icon: Terminal,
    category: "Kỹ năng",
  },
  {
    label: "Công nghệ",
    value: "Layers",
    icon: Layers,
    category: "Kỹ năng",
  },

  // Ngôn ngữ
  {
    label: "Ngôn ngữ",
    value: "Languages",
    icon: Languages,
    category: "Ngôn ngữ",
  },
  {
    label: "Giao tiếp",
    value: "MessageSquare",
    icon: MessageSquare,
    category: "Ngôn ngữ",
  },
  {
    label: "Liên lạc",
    value: "MessagesSquare",
    icon: MessagesSquare,
    category: "Ngôn ngữ",
  },

  // Dự án
  {
    label: "Dự án",
    value: "FolderGit2",
    icon: FolderGit2,
    category: "Dự án",
  },
  {
    label: "Nhánh",
    value: "GitBranch",
    icon: GitBranch,
    category: "Dự án",
  },
  {
    label: "Phát hành",
    value: "Rocket",
    icon: Rocket,
    category: "Dự án",
  },
  {
    label: "Mục tiêu",
    value: "Target",
    icon: Target,
    category: "Dự án",
  },

  // Thành tích
  {
    label: "Cúp",
    value: "Trophy",
    icon: Trophy,
    category: "Thành tích",
  },
  {
    label: "Huy chương",
    value: "Medal",
    icon: Medal,
    category: "Thành tích",
  },
  {
    label: "Ngôi sao",
    value: "Star",
    icon: Star,
    category: "Thành tích",
  },

  // Sở thích
  {
    label: "Sở thích",
    value: "Heart",
    icon: Heart,
    category: "Sở thích",
  },
  {
    label: "Âm nhạc",
    value: "Music",
    icon: Music,
    category: "Sở thích",
  },
  {
    label: "Nghệ thuật",
    value: "Palette",
    icon: Palette,
    category: "Sở thích",
  },
  {
    label: "Nhiếp ảnh",
    value: "Camera",
    icon: Camera,
    category: "Sở thích",
  },

  // Mạng xã hội
  {
    label: "Github",
    value: "Github",
    icon: Github,
    category: "Mạng xã hội",
  },
  {
    label: "LinkedIn",
    value: "Linkedin",
    icon: Linkedin,
    category: "Mạng xã hội",
  },
  {
    label: "Twitter",
    value: "Twitter",
    icon: Twitter,
    category: "Mạng xã hội",
  },
  {
    label: "Facebook",
    value: "Facebook",
    icon: Facebook,
    category: "Mạng xã hội",
  },
  {
    label: "Instagram",
    value: "Instagram",
    icon: Instagram,
    category: "Mạng xã hội",
  },

  // Khác
  {
    label: "Hồ sơ",
    value: "FileText",
    icon: FileText,
    category: "Khác",
  },
  {
    label: "Đánh giá",
    value: "FileCheck",
    icon: FileCheck,
    category: "Khác",
  },
  {
    label: "Lọc",
    value: "Filter",
    icon: Filter,
    category: "Khác",
  },
  {
    label: "Liên kết",
    value: "Link",
    icon: Link,
    category: "Khác",
  },
  {
    label: "Lương",
    value: "Wallet",
    icon: Wallet,
    category: "Khác",
  },
  {
    label: "Ý tưởng",
    value: "Lightbulb",
    icon: Lightbulb,
    category: "Khác",
  },
  {
    label: "Gửi",
    value: "Send",
    icon: Send,
    category: "Khác",
  },
  {
    label: "Chia sẻ",
    value: "Share2",
    icon: Share2,
    category: "Khác",
  },
  {
    label: "Cài đặt",
    value: "Settings",
    icon: Settings,
    category: "Khác",
  },
  {
    label: "Tìm kiếm",
    value: "SearchIcon",
    icon: SearchIcon,
    category: "Khác",
  },
  {
    label: "Cờ",
    value: "Flag",
    icon: Flag,
    category: "Khác",
  },
  {
    label: "Đánh dấu",
    value: "Bookmark",
    icon: Bookmark,
    category: "Khác",
  },
  {
    label: "Thích",
    value: "ThumbsUp",
    icon: ThumbsUp,
    category: "Khác",
  },
  {
    label: "Kỹ năng",
    value: "Zap",
    icon: Zap,
    category: "Khác",
  },
];

const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  const iconOptions = React.useMemo(() => getIconOptions(), []);
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isHovered, setIsHovered] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Tất cả");

  const selectedIcon =
    iconOptions.find((i) => i.value === value) || iconOptions[0];
  const Icon = selectedIcon.icon;

  const categories = [
    "Tất cả",
    ...Array.from(new Set(iconOptions.map((icon) => icon.category))),
  ];

  const filteredIcons = iconOptions.filter((icon) => {
    const matchesSearch =
      icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (iconValue: string) => {
    onChange(iconValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-8 h-8 p-2 rounded-md relative overflow-hidden",
            "transform-gpu transition-all duration-300 ease-out",
            "dark:bg-neutral-800 dark:hover:bg-neutral-700/90",
            "bg-white hover:bg-neutral-50/90 "
          )}
        >
          <Icon
            className={cn(
              "w-4 h-4 transform-gpu transition-transform duration-300",
              "hover:rotate-[360deg]",
              "dark:text-neutral-200",
              "text-neutral-700"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[420px] p-4",
          "dark:bg-neutral-900 dark:border-neutral-800",
          "bg-white border-neutral-200",
          "shadow-lg backdrop-blur-sm",
          "animate-in zoom-in-95 duration-200"
        )}
      >
        <div className="space-y-3">
          <div
            className={cn(
              "flex border items-center gap-2 px-3 py-2 rounded-lg",
              "transform-gpu transition-all duration-300",
              "dark:bg-neutral-800/50  dark:border-neutral-700",
              "bg-neutral-50 border border-neutral-200",
              "dark:focus-within:ring-blue-500/30",
              "focus-within:ring-blue-500/20"
            )}
          >
            <Search
              className={cn(
                "w-4 h-4 transition-colors duration-300",
                "dark:text-neutral-400",
                "text-neutral-500"
              )}
            />
            <input
              type="text"
              placeholder="Tìm kiếm icon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full bg-transparent border-none outline-none text-sm",
                "transition-colors duration-300",
                "dark:text-neutral-200",
                "text-neutral-700",
                "placeholder:text-neutral-500",
                "focus:ring-0"
              )}
            />
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-2 py-1 text-xs rounded-md",
                  "transition-all duration-200",
                  selectedCategory === category
                    ? "bg-primary text-white dark:ring-1 dark:ring-blue-500/30  ring-1 ring-blue-500/20"
                    : "dark:text-white  text-neutral-600 hover:text-neutral-900"
                )}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-8 gap-2 max-h-[400px] overflow-x-hidden overflow-y-auto pr-2">
            {filteredIcons.map(({ value: iconValue, icon: Icon, label }) => (
              <Button
                key={iconValue}
                variant="ghost"
                onMouseEnter={() => setIsHovered(iconValue)}
                onMouseLeave={() => setIsHovered("")}
                onClick={() => handleSelect(iconValue)}
                className={cn(
                  "relative p-2 h-10  group",
                  "dark:hover:bg-neutral-800/70 dark:text-neutral-300 hover:text-neutral-200",
                  "hover:bg-neutral-100/70 text-neutral-600 hover:text-neutral-900",
                  value === iconValue && "bg-primary text-white  "
                )}
              >
                <Icon className={cn("w-4 h-4")} />
                <span
                  className={cn(
                    "absolute -top-9 left-1/2 -translate-x-1/2",
                    "px-2 py-1 text-xs rounded-md",
                    "opacity-0 translate-y-1",
                    "group-hover:opacity-100 group-hover:translate-y-0",
                    "pointer-events-none",
                    "dark:bg-neutral-800 dark:text-neutral-200 border dark:border-neutral-700",
                    "bg-white text-neutral-700 border dark:border-neutral-200",
                    "shadow-sm whitespace-nowrap z-10"
                  )}
                >
                  {label}
                </span>
                {isHovered === iconValue && (
                  <span
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r",
                      "dark:from-blue-500/10 dark:to-purple-500/10",
                      "from-blue-500/5 to-purple-500/5",
                      "animate-in fade-in duration-300"
                    )}
                  />
                )}
              </Button>
            ))}
          </div>

          {filteredIcons.length === 0 && (
            <div
              className={cn(
                "flex flex-col items-center justify-center py-8 px-4",
                "text-sm",
                "dark:text-neutral-400",
                "text-neutral-500"
              )}
            >
              <SearchIcon className="w-12 h-12 mb-2 opacity-20" />
              <p>Không tìm thấy icon phù hợp</p>
              <p className="text-xs opacity-70">
                {searchTerm ? "Thử từ khóa khác" : "Chọn danh mục khác"}
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IconSelector;
