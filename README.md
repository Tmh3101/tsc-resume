# The Student Company (TSC)

**Hệ sinh thái toàn diện cho sinh viên: Xây dựng CV chuyên nghiệp, phân tích AI, quản lý sự kiện và kết nối công ty.**

Nền tảng khởi nghiệp và việc làm thực chiến giúp sinh viên tại Cần Thơ (ĐBSCL) phát triển kỹ năng và xây dựng sự nghiệp.

---

## 🎯 Tính năng chính

### 1. **Resume Builder** (CV Editor)
- **URL:** `/workbench/[id]`
- Xây dựng CV từ 4 template chuyên nghiệp:
  - **Classic:** Cổ điển, đơn giản
  - **Modern:** Hiện đại, đẹp mắt
  - **Highlight:** Nhấn mạnh các điểm nổi bật
  - **Timeline:** Trình bày lịch sử chuyên môn
- Tùy chỉnh đầy đủ:
  - Thông tin cơ bản (tên, email, điện thoại, địa chỉ)
  - Giáo dục, kinh nghiệm, kỹ năng, dự án
  - Bố cục, màu sắc, khoảng cách, font
  - Đề mục tùy chỉnh (custom sections)
- **Export:** PDF (Puppeteer), JSON
- Auto-save khi chỉnh sửa
- Xem trước real-time

### 2. **Resume Analyzer** (AI-Powered)
- **URL:** `/resume-analyze`
- Phân tích CV với **Cerebras AI** (120B model):
  - 📊 **Điểm ATS:** Khả năng vượt hệ thống tuyển dụng tự động
  - 💬 **Phân tích giọng văn:** Chuyên nghiệp, rõ ràng
  - 📝 **Nội dung:** Từ khóa, mô tả công việc
  - 🏗️ **Cấu trúc:** Bố cục, định dạng
  - 🎯 **Kỹ năng:** Phù hợp với công việc
- **Gợi ý cải thiện** từng dòng (line-by-line)
- **Import Job** từ URL hoặc PDF (Nutrient API)
- **Cold Outreach:** Tạo tin nhắn LinkedIn tự động
- Lưu kết quả phân tích vào database

### 3. **Dashboard & Management**
- **URL:** `/dashboard`
- Quản lý danh sách CV:
  - Xem, chỉnh sửa, sao chép, xóa CV
  - Tìm kiếm CV
  - Thông tin cập nhật gần nhất
  - Grid view với template accent colors
- **Tạo CV mới từ template selector**

### 4. **Admin Dashboard**
- **URL:** `/admin` (Protected)
- **Login:** `/admin/login`
- Quản lý ứng viên:
  - Danh sách applications (ứng tuyển)
  - Xem chi tiết ứng viên
  - Cập nhật trạng thái (pending, reviewed, accepted, rejected)
  - Xóa ứng viên
- Quản lý phỏng vấn:
  - Lịch phỏng vấn
  - Kết quả phỏng vấn (pending, passed, failed, canceled)
- Quản lý đối tác:
  - Danh sách công ty đối tác
  - Thông tin liên hệ
- Quản lý sự kiện:
  - Lịch biểu sinh viên
- **Chế độ bảo trì:**
  - Toggle bảo trì từ `/admin/system`
  - Lưu vào database `system_settings`
  - Khi bật: Tất cả trang (trừ /admin) hiển thị thông báo bảo trì

### 5. **Landing Page**
- **URL:** `/`
- Sections:
  - 🎨 **Hero** - Tuyên bố sứ mệnh với Particles background
  - ℹ️ **About** - Flip cards (Khởi nghiệp, Việc làm, Kỹ năng)
  - 💪 **Core Values** - T-S-C: Trust, Smart, Connection
  - 📈 **Timeline** - Lộ trình IPIAL 5 giai đoạn
  - 🛠️ **Services** - Bento Grid các dịch vụ
  - 👥 **Organization Structure** - Squad model interactive
  - 📝 **Application Form** - Đơn ứng tuyển Talent Pool
  - 📞 **Footer** - Liên hệ, mạng xã hội

---

## 🚀 Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion, tw-animate-css
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Backend:** Supabase (Auth + Database + Storage)
- **AI:** Cerebras API (Resume Analysis, gpt-oss-120b)
- **PDF Processing:** Nutrient API (PDF → Markdown), Puppeteer (PDF Export)
- **State:** Zustand + React Context
- **Language:** TypeScript

---

## 🏗️ Database Schema

### Tables:

#### 1. **applications** - Đơn ứng tuyển
```
- id: UUID (PK)
- created_at: Timestamp
- full_name, email, phone: Text
- university, major, portfolio_link: Text
- status: Enum (pending, reviewed, accepted, rejected)
```

#### 2. **resumes** - CV người dùng
```
- id: UUID (PK)
- user_id: UUID (FK → users)
- template_id: Text (FK → templates)
- title: Text
- basic_info, education, experience, projects: JSONB
- skill_content, custom_data, menu_sections: JSONB
- global_settings: JSONB (màu sắc, khoảng cách, fonts)
- is_public, is_deleted: Boolean
- last_edited_at, created_at, updated_at: Timestamp

Indexes: user_id, template_id, created_at DESC, updated_at DESC
Triggers: resumes_updated_at (auto cập nhật)
```

#### 3. **templates** - CV Templates
```
- id: Text (PK)
- name, description: Text
- thumbnail_url: Text
- layout: Enum (classic, modern, left-right, professional, timeline)
- color_scheme, spacing, basic_config: JSONB
- is_active, is_premium: Boolean
- created_at, updated_at: Timestamp

Triggers: templates_updated_at (auto cập nhật)
```

#### 4. **resume_analyze** - Kết quả phân tích
```
- id: UUID (PK)
- job_title, job_description: Text
- resume_markdown: Text
- feedback: JSONB (ATS score, suggestions, etc.)
- resume_url: Text
- created_at, updated_at: Timestamp

Triggers: resumes_updated_at (auto cập nhật)
```

#### 5. **interviews** - Lịch phỏng vấn
```
- id: UUID (PK)
- application_id: UUID (FK → applications, CASCADE)
- interview_date: Timestamp
- interviewer_name, notes, meeting_link: Text
- result: Enum (pending, passed, failed, canceled)
- created_at: Timestamp
```

#### 6. **schedules** - Lịch sự kiện
```
- id: UUID (PK)
- student_id: UUID (FK → applications, CASCADE)
- title, description: Text
- start_time, end_time, location: Timestamp/Text
- status: Text (default: scheduled)
- created_at: Timestamp
```

#### 7. **partners** - Công ty đối tác
```
- id: UUID (PK)
- company_name: Text
- contact_person, email, phone, industry: Text
- status: Text (default: potential)
- created_at: Timestamp
```

#### 8. **system_settings** - Cài đặt hệ thống
```
- id: UUID (PK)
- key: Varchar(255) UNIQUE
- value, description: Text
- updated_by: Varchar(255)
- created_at, updated_at: Timestamp

Index: key
Default: maintenance_mode = 'false'
```

---

## 📁 Cấu trúc dự án chi tiết

```
app/
├── globals.css                      # Design system, colors, typography
├── layout.tsx                       # Root layout (fonts, SEO, providers)
├── page.tsx                         # Landing page (/)
├── not-found.tsx                    # 404 page
├── robots.ts, sitemap.ts            # SEO
│
├── api/                             # API Routes
│   ├── admin/system/route.ts        # [GET] Lấy settings, [POST] Update
│   ├── applications/route.ts        # [GET] Danh sách, [POST] Tạo
│   ├── resume-analyze/
│   │   ├── route.ts                 # [POST] Phân tích CV (Cerebras AI)
│   │   ├── import-pdf/route.ts      # [POST] Đọc PDF job (Nutrient)
│   │   ├── import-url/route.ts      # [POST] Scrape job từ URL
│   │   ├── regenerate-dm/route.ts   # [POST] Tạo Cold DM message
│   │   └── resume/[id]/preview/route.ts  # [GET] PDF preview
│   ├── resume-templates/
│   │   ├── route.ts                 # [GET] Danh sách templates
│   │   └── [id]/route.ts            # [GET] Chi tiết template
│   ├── resumes/
│   │   ├── route.ts                 # [GET] Danh sách, [POST] Tạo CV
│   │   ├── [id]/route.ts            # [GET] Chi tiết, [PATCH] Update, [DELETE] Xóa
│   │   ├── [id]/duplicate/route.ts  # [POST] Sao chép CV
│   │   └── export-pdf/route.ts      # [POST] Export PDF (Puppeteer)
│   └── auth/callback/route.ts       # [GET] OAuth callback
│
├── admin/                           # Admin Dashboard (Protected)
│   ├── layout.tsx                   # Layout + sidebar
│   ├── page.tsx                     # Overview
│   ├── applications/page.tsx        # Quản lý ứng tuyển
│   ├── interviews/page.tsx          # Quản lý phỏng vấn
│   ├── partners/page.tsx            # Quản lý đối tác
│   ├── schedules/page.tsx           # Quản lý sự kiện
│   ├── system/page.tsx              # Cài đặt hệ thống
│   └── login/page.tsx               # Login admin
│
├── dashboard/                       # User Dashboard (Protected)
│   ├── layout.tsx                   # Layout
│   ├── page.tsx                     # Danh sách CV
│   └── templates/page.tsx           # Chọn template tạo CV
│
├── login/page.tsx                   # User login
├── maintenance/page.tsx             # Trang bảo trì
├── resume/page.tsx, /[id]/page.tsx  # Analyzer & results
└── workbench/[id]/page.tsx          # Resume editor

components/
├── Navbar.tsx                       # Navigation bar
├── admin/
│   ├── AdminSidebar.tsx             # Sidebar navigation
│   ├── AdminUI.tsx                  # UI wrapper
│   ├── MaintenanceOverlay.tsx       # Status overlay
│   ├── MaintenancePage.tsx          # Full maintenance page
│   └── Modal.tsx                    # Reusable modal
├── analyze/                         # Resume Analyzer
│   ├── FileUploader.tsx             # Drag-drop upload
│   ├── UploadForm.tsx               # Form upload + job input
│   ├── ImportJobModal.tsx           # Import from URL/PDF
│   ├── AnalysisSection.tsx          # Each analysis section
│   ├── ATS.tsx, ScoreGauge.tsx      # Score display
│   ├── LineByLineImprovements.tsx   # Suggestions
│   ├── ColdOutreach.tsx             # Cold DM message
│   └── [other components...]
├── dashboard/
│   ├── AuthOverlay.tsx              # Protected route wrapper
│   ├── DashboardContext.tsx         # Context + hooks
│   ├── DashboardSidebar.tsx         # Sidebar
│   └── LoginModal.tsx               # Login modal
├── editor/                          # Resume Editor
│   ├── EditorHeader.tsx             # Title, export, actions
│   ├── EditPanel.tsx, SidePanel.tsx # Side panel
│   ├── basic/BasicPanel.tsx         # Thông tin cơ bản
│   ├── education/EducationPanel.tsx # Giáo dục
│   ├── experience/ExperiencePanel.tsx # Kinh nghiệm
│   ├── project/ProjectPanel.tsx     # Dự án
│   ├── skills/SkillPanel.tsx        # Kỹ năng
│   ├── custom/CustomPanel.tsx       # Custom sections
│   └── layout/LayoutSetting.tsx     # Bố cục & styles
├── preview/                         # Resume Preview
│   ├── index.tsx                    # Preview wrapper
│   ├── BaseInfo.tsx                 # Thông tin cơ bản
│   ├── EducationSection.tsx         # Giáo dục
│   ├── ExperienceSection.tsx        # Kinh nghiệm
│   ├── ProjectSection.tsx           # Dự án
│   ├── SkillPanel.tsx               # Kỹ năng
│   └── [other components...]
├── shared/
│   ├── PdfExport.tsx                # Export PDF button (NEW)
│   ├── PhotoSelector.tsx            # Photo upload
│   ├── TemplateSheet.tsx            # Template selection
│   ├── ThemeModal.tsx               # Color picker
│   └── rich-editor/RichEditor.tsx   # Tiptap editor
├── templates/                       # Template Components
│   ├── ClassicTemplate.tsx
│   ├── ModernTemplate.tsx
│   ├── LeftRightTemplate.tsx
│   └── TimelineTemplate.tsx
├── sections/                        # Landing Page
│   ├── Hero.tsx, About.tsx
│   ├── CoreValues.tsx, Services.tsx
│   ├── Timeline.tsx, OrgStructure.tsx
│   ├── ApplicationForm.tsx
│   └── Footer.tsx
└── ui/                              # shadcn/ui Components
    ├── button.tsx, input.tsx
    ├── dropdown-menu.tsx, dialog.tsx
    ├── [other UI components...]

config/
├── index.ts                         # Constants (PDF_EXPORT_CONFIG, etc.)
├── initialResumeData.ts             # Default CV data
└── templates.ts                     # Template configs

constants/
└── index.ts                         # App constants

hooks/
├── useResumesApi.ts                 # CRUD resumes + duplicate
├── useTemplatesApi.ts               # Get templates
└── useGrammarCheck.ts               # Grammar check

lib/
├── api.ts                           # API helpers
├── email.ts                         # Email (Resend)
├── pdf-service.ts                   # Nutrient API
├── richText.ts                      # Rich text utils
├── utils.ts                         # Utility functions
├── resume-analyze/
│   ├── ai.ts                        # Cerebras integration
│   ├── ai-helpers.ts                # AI prompts
│   └── job-import.ts                # Job scraping
├── supabase/
│   ├── client.ts                    # Client-side SDK
│   └── server.ts                    # Server-side SDK
└── validations/
    ├── analyze.ts                   # Zod schemas
    └── application.ts               # Zod schemas

store/                              # Zustand
├── useResumeStore.ts               # CV data + CRUD
├── useTemplateStore.ts             # Templates
└── useAIConfigStore.ts             # AI config

types/
├── index.ts                        # Shared types
├── resume.ts                       # Resume types
├── template.ts                     # Template types
└── db/
    ├── resume.ts
    └── template.ts

styles/
└── tiptap.scss                     # Tiptap editor

supabase/
└── migrations/                     # SQL migrations
```

---

## 🔧 Installation & Setup

### 1. Clone Repository
```bash
git clone <repo-url>
cd TSC
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env.local`
```bash
cp .env.example .env.local
```

### 4. Configure Environment Variables
Edit `.env.local` with real values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxxx

# Cerebras AI
CEREBRAS_API_KEY=csk-xxxxx
CEREBRAS_MODEL_NAME=gpt-oss-120b

# Nutrient PDF
NUTRIENT_API_KEY=pdf_live_xxxxx
```

### 5. Setup Database
Run SQL migrations in Supabase SQL Editor (see schema section above)

### 6. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Build & Production
```bash
npm run build
npm start
```

---

## 📦 Key Dependencies

### Core
- **next**: 16.1.1, **react**: 19.2.3, **typescript**: ^5

### UI & Styling
- **tailwindcss**: ^4, **framer-motion**: ^12.23.26
- **@radix-ui**: Headless components
- **lucide-react**: ^0.562.0 (Icons)

### Forms
- **react-hook-form**: ^7.69.0, **zod**: ^4.2.1

### Backend
- **@supabase/supabase-js**: ^2.89.0
- **axios**: ^1.13.2

### PDF & Document
- **puppeteer-core**: ^24.36.0 + **@sparticuz/chromium**: ^143.0.4
- **react-pdf**: ^10.3.0

### Rich Text
- **@tiptap/react**: ^3.17.1
- Text formatting extensions

### AI & Utilities
- **@cerebras/cerebras_cloud_sdk**: ^1.64.1
- **date-fns**: ^4.1.0, **lodash**: ^4.17.23
- **zustand**: ^5.0.10 (State)
- **sonner**: ^2.0.7 (Toast)

---

## 📚 Development Guide

### Protected Routes
- Use `<AuthOverlay>` wrapper
- Middleware checks auth + maintenance mode

### PDF Export (NEW)
- **Local:** Full `puppeteer`
- **Vercel:** `puppeteer-core` + `@sparticuz/chromium`
- API: `POST /api/resumes/export-pdf`
- Features: A4, printBackground, styles injected

### State Management
- **Zustand:** Resumes, templates
- **React Context:** Dashboard
- **Local Storage:** UI state

### Database Best Practices
- Indexes on frequently queried columns
- Auto-update triggers for timestamps
- Soft deletes (`is_deleted` flag)
- Foreign key constraints

### Styling
- Tailwind utilities
- CSS variables for design tokens
- Mobile-first responsive design
- Dark mode support

---

## 🚀 Deployment (Vercel)

### 1. Setup Vercel Project
```bash
vercel link
```

### 2. Add Environment Variables
Vercel Dashboard → Settings → Environment Variables

### 3. Configure Vercel (optional)
Create `vercel.json`:
```json
{
  "functions": {
    "app/api/resumes/export-pdf/route.ts": {
      "maxDuration": 60
    }
  }
}
```

### 4. Deploy
```bash
git push  # Auto-deploy via GitHub
# or: vercel --prod
```

---

## 🎨 Design System

### Colors
- **Primary:** Orange (#f29427)
- **Dark:** Navy (#0e3963)
- **Accents:** Blue, Purple, Green, Rose (templates)
- **Neutral:** Gray scale (50-950)

### Typography
- **Headings:** Outfit (700 bold)
- **Body:** Inter (400)

### Spacing
- Grid: 4px base
- Padding: 2, 3, 4, 6, 8 units
- Gap: 2, 3, 4, 6 units

### Effects
- Shadows, borders, radius
- Transitions, animations

---

## 🐛 Troubleshooting

### Build Errors
- Missing modules: `npm install`
- TypeScript: Check `tsconfig.json`

### Runtime Errors
- Auth issues: Check Supabase config
- PDF export fails: Check timeout, content size
- AI timeout: Increase timeout in config

### Database Issues
- Foreign key errors: Check related records
- Trigger not firing: Verify trigger creation
- RLS blocking: Check policies

---

## 📞 Contact

- **Email:** support@thestudentcompany.vn
- **Hotline:** +84 783 767 845
- **Address:** Ninh Kiều, Cần Thơ, Việt Nam

---

**© 2025 The Student Company. All rights reserved.**

**Happy Coding! 🚀**
