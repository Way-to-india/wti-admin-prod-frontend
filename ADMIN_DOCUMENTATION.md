# Way to India - Admin Panel Documentation

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Dashboard Features](#dashboard-features)
- [Components Architecture](#components-architecture)
- [Services & API Integration](#services--api-integration)
- [Type System](#type-system)
- [Setup Instructions](#setup-instructions)
- [Development Workflows](#development-workflows)

---

## Project Overview

The Way to India Admin Panel is a **Next.js 16** application providing a comprehensive dashboard for managing the entire platform. It includes CRM for lead management, tour management, user management, content management, and system administration.

### Key Features

- **CRM System**: Complete lead lifecycle management
- **Tour Management**: Create, edit, and manage tour packages
- **Travel Guide Management**: Manage states, cities, and guide content
- **User Management**: View users, send emails, manage accounts
- **Admin Management**: Roles, permissions, and access control
- **Content Management**: Hero slides, destinations, POI data
- **Analytics Dashboard**: Statistics and insights

---

## Technology Stack

| Technology         | Purpose                            |
| ------------------ | ---------------------------------- |
| **Next.js 16**     | React framework with App Router    |
| **React 19**       | UI library                         |
| **TypeScript**     | Type safety                        |
| **TailwindCSS 4**  | Utility-first CSS framework        |
| **Shadcn UI**      | Component library (Radix UI based) |
| **TipTap**         | Rich text editor                   |
| **Recharts**       | Charts and data visualization      |
| **Tanstack Table** | Advanced table component           |
| **DND Kit**        | Drag-and-drop functionality        |
| **Axios**          | HTTP client                        |
| **Zod**            | Schema validation                  |
| **Date-fns**       | Date manipulation                  |
| **Sonner**         | Toast notifications                |
| **React Dropzone** | File upload                        |
| **Next Themes**    | Dark mode support                  |

---

## Project Structure

```
way-to-india-admin/
├── app/                        # Next.js App Router
│   ├── dashboard/             # Main dashboard
│   │   ├── page.tsx          # Dashboard home
│   │   ├── layout.tsx        # Dashboard layout
│   │   ├── crm/              # CRM section
│   │   │   ├── leads/        # Lead management
│   │   │   ├── activities/   # Lead activities
│   │   │   ├── quotations/   # Quotations
│   │   │   ├── reminders/    # Reminders
│   │   │   ├── tags/         # Lead tags
│   │   │   └── categories/   # Lead categories
│   │   ├── tours/            # Tour management
│   │   │   ├── page.tsx      # Tour list
│   │   │   ├── create/       # Create tour
│   │   │   ├── edit/[id]/    # Edit tour
│   │   │   └── [id]/         # Tour details
│   │   ├── travel-guide/     # Travel guide
│   │   │   ├── states/       # States management
│   │   │   ├── cities/       # Cities management
│   │   │   └── data/         # Guide data
│   │   ├── users/            # User management
│   │   ├── admins/           # Admin management
│   │   ├── roles/            # Role management
│   │   ├── permissions/      # Permissions
│   │   ├── modules/          # Module management
│   │   ├── destinations/     # Destinations
│   │   ├── hero-slides/      # Hero carousel
│   │   └── notifications/    # Notifications
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing/redirect
│   └── globals.css           # Global styles
├── components/                # React components
│   ├── ui/                   # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   └── ... (30+ components)
│   ├── dashboard/            # Dashboard-specific
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatsCard.tsx
│   │   └── RecentActivity.tsx
│   ├── crm/                  # CRM components
│   │   ├── LeadTable.tsx
│   │   ├── LeadDialog.tsx
│   │   ├── LeadDetails.tsx
│   │   ├── ActivityTimeline.tsx
│   │   ├── QuotationUpload.tsx
│   │   └── ReminderForm.tsx
│   ├── tours/                # Tour components
│   │   ├── TourForm.tsx
│   │   ├── TourTable.tsx
│   │   ├── ItineraryEditor.tsx
│   │   └── ImageUpload.tsx
│   ├── travel-guide/         # Travel guide components
│   │   ├── StateTable.tsx
│   │   ├── CityTable.tsx
│   │   └── GuideDataForm.tsx
│   ├── users/                # User components
│   │   ├── UserTable.tsx
│   │   ├── UserDetails.tsx
│   │   └── EmailDialog.tsx
│   └── shared/               # Shared components
│       ├── RichTextEditor.tsx
│       ├── DataTable.tsx
│       ├── FileUpload.tsx
│       └── SearchFilter.tsx
├── services/                  # API services
│   ├── api.ts                # Axios instance
│   ├── endpoints.ts          # API endpoints
│   ├── auth.service.ts       # Auth service
│   ├── crm.service.ts        # CRM service
│   ├── tour.service.ts       # Tour service
│   ├── user.service.ts       # User service
│   ├── travel-guide.service.ts
│   └── ... (more services)
├── types/                     # TypeScript types
│   ├── lead.ts
│   ├── tour.ts
│   ├── user.ts
│   ├── admin.ts
│   └── common.ts
├── lib/                       # Utilities
│   ├── utils.ts              # Helper functions
│   └── validators.ts         # Zod schemas
├── hooks/                     # Custom hooks
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   └── useDebounce.ts
├── contexts/                  # React contexts
│   └── AuthContext.tsx
├── constants/                 # Constants
│   └── index.ts
└── helpers/                   # Helper functions
```

---

## Dashboard Features

### 1. CRM System (`/dashboard/crm`)

#### Lead Management (`/dashboard/crm/leads`)

- **Lead List**: Filterable, sortable table with pagination
  - Filters: status, priority, source, assigned admin, date range
  - Sorting: by date, priority, status, lead score
  - Bulk actions: assign, update status, delete
- **Lead Details**: Complete lead information
  - Customer details
  - Service requirements
  - Status and priority
  - Assignment
  - Tags and categories
- **Lead Creation**: Form to create new leads manually
- **Lead Editing**: Update lead information

#### Activities (`/dashboard/crm/leads/[id]`)

- Activity timeline for each lead
- Log new activities (calls, emails, meetings, notes)
- Activity filtering and search

#### Notes

- Add internal notes to leads
- Attach files to notes
- Edit and delete notes

#### Quotations (`/dashboard/crm/leads/[id]`)

- Upload quotation PDFs
- Version tracking
- Mark quotations as accepted
- Track email opens

#### Communications

- Log all communications (calls, emails, WhatsApp, SMS)
- Track direction (inbound/outbound)
- Duration tracking for calls
- Communication history

#### Reminders (`/dashboard/crm/reminders`)

- Create follow-up reminders
- Assign to admins
- Snooze functionality
- Mark as complete
- Reminder notifications

#### Configuration

- **Tags**: Create and manage lead tags
- **Categories**: Lead categorization
- **Sources**: Lead source configuration

### 2. Tour Management (`/dashboard/tours`)

- **Tour List**: View all tours with filters
  - Filter by theme, city, status, featured
  - Sort by date, rating, bookings, views
  - Search by title
- **Create Tour**: Rich form with multiple sections
  - Basic info (title, slug, meta tags)
  - Description (rich text editor)
  - Pricing and duration
  - Images (multiple upload)
  - Itinerary (day-by-day with rich text)
  - Highlights, inclusions, exclusions
  - FAQs
  - Cities and themes
  - Cancellation policy (rich text)
- **Edit Tour**: Update existing tours
- **Delete Tour**: Remove tours
- **Tour Preview**: View tour as it appears on frontend

### 3. Travel Guide Management (`/dashboard/travel-guide`)

#### States (`/dashboard/travel-guide/states`)

- List all states
- Create, edit, delete states
- View cities in each state

#### Cities (`/dashboard/travel-guide/cities`)

- List all cities
- Create, edit, delete cities
- Filter by state
- Assign to states

#### Guide Data (`/dashboard/travel-guide/data`)

- Comprehensive city information
- Tabbed form:
  - Introduction
  - Facts
  - Food & Dining
  - Shopping
  - Nearby Places
  - Getting Around
  - History & Culture
  - Other Details
  - Best Time to Visit
  - Places to See
  - Hotel Details
- Rich text editor for all content fields
- Image upload for city

### 4. User Management (`/dashboard/users`)

- **User List**: View all registered users
  - Search by name, email, phone
  - Filter by status (active/inactive)
  - Sort by registration date
- **User Details**: View user profile and activity
  - Profile information
  - Booking history
  - Reviews submitted
- **Send Email**: Compose and send emails to users
  - Rich text editor
  - Select multiple recipients
  - Email templates
- **User Actions**: Activate, deactivate, delete users

### 5. Admin Management

#### Admins (`/dashboard/admins`)

- List all admin users
- Create new admins
- Edit admin details
- Assign roles
- Activate/deactivate admins

#### Roles (`/dashboard/roles`)

- Create and manage roles
- Assign permissions to roles
- View admins with each role

#### Permissions (`/dashboard/permissions`)

- Module-level permissions
- Granular access control (view, create, edit, delete)
- Permission matrix view

#### Modules (`/dashboard/modules`)

- System module configuration
- Module activation/deactivation

### 6. Content Management

#### Hero Slides (`/dashboard/hero-slides`)

- Manage homepage carousel
- Create, edit, delete slides
- Upload images
- Set title, subtitle, CTA
- Drag-and-drop reordering
- Activate/deactivate slides

#### Destinations (`/dashboard/destinations`)

- Manage destination pages
- City information
- Images and descriptions

### 7. Notifications (`/dashboard/notifications`)

- Lead assignment notifications
- System notifications
- Mark as read
- Notification preferences

### 8. Dashboard Home (`/dashboard`)

- **Statistics Cards**:
  - Total leads
  - Active tours
  - Registered users
  - Revenue metrics
- **Charts**:
  - Lead trends over time
  - Tour bookings
  - User registrations
- **Recent Activity**: Latest leads, bookings, reviews
- **Quick Actions**: Create lead, create tour, etc.

---

## Components Architecture

### Shadcn UI Components (`components/ui/`)

Pre-built, customizable components:

- `Button` - Various button styles
- `Dialog` - Modal dialogs
- `Table` - Data tables
- `Form` - Form components with validation
- `Input`, `Textarea`, `Select` - Form inputs
- `Tabs` - Tabbed interfaces
- `Card` - Card containers
- `Badge` - Status badges
- `Avatar` - User avatars
- `Dropdown Menu` - Dropdown menus
- `Checkbox`, `Switch` - Toggle inputs
- `Alert Dialog` - Confirmation dialogs
- `Scroll Area` - Scrollable areas
- `Separator` - Visual separators
- `Label` - Form labels
- `Tooltip` - Tooltips

### Custom Components

#### Rich Text Editor (`components/shared/RichTextEditor.tsx`)

Built with TipTap, supports:

- Bold, italic, underline
- Headings (H1-H6)
- Lists (ordered, unordered)
- Links
- Images
- Text alignment
- Code blocks
- Blockquotes

**Usage:**

```typescript
<RichTextEditor value={content} onChange={setContent} placeholder="Enter content..." />
```

#### Data Table (`components/shared/DataTable.tsx`)

Reusable table with:

- Sorting
- Filtering
- Pagination
- Row selection
- Custom cell rendering

**Usage:**

```typescript
<DataTable columns={columns} data={data} onRowClick={handleRowClick} pagination searchable />
```

#### File Upload (`components/shared/FileUpload.tsx`)

Drag-and-drop file upload with:

- Multiple file support
- File type validation
- Size limits
- Preview

**Usage:**

```typescript
<FileUpload
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  onUpload={handleUpload}
  multiple
/>
```

---

## Services & API Integration

### API Configuration (`services/api.ts`)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service Pattern

**Example: CRM Service** (`services/crm.service.ts`)

```typescript
import api from './api';
import { ENDPOINTS } from './endpoints';

export const crmService = {
  // Leads
  async getLeads(params?: LeadFilters) {
    const { data } = await api.get(ENDPOINTS.CRM.LEADS, { params });
    return data;
  },

  async getLeadById(id: string) {
    const { data } = await api.get(ENDPOINTS.CRM.LEAD_BY_ID(id));
    return data;
  },

  async createLead(leadData: CreateLeadDto) {
    const { data } = await api.post(ENDPOINTS.CRM.LEADS, leadData);
    return data;
  },

  async updateLead(id: string, leadData: UpdateLeadDto) {
    const { data } = await api.put(ENDPOINTS.CRM.LEAD_BY_ID(id), leadData);
    return data;
  },

  async deleteLead(id: string) {
    const { data } = await api.delete(ENDPOINTS.CRM.LEAD_BY_ID(id));
    return data;
  },

  // Activities
  async getActivities(leadId: string) {
    const { data } = await api.get(ENDPOINTS.CRM.ACTIVITIES(leadId));
    return data;
  },

  async createActivity(leadId: string, activityData: CreateActivityDto) {
    const { data } = await api.post(ENDPOINTS.CRM.ACTIVITIES(leadId), activityData);
    return data;
  },

  // Notes
  async getNotes(leadId: string) {
    const { data } = await api.get(ENDPOINTS.CRM.NOTES(leadId));
    return data;
  },

  async createNote(leadId: string, noteData: CreateNoteDto) {
    const { data } = await api.post(ENDPOINTS.CRM.NOTES(leadId), noteData);
    return data;
  },

  // Quotations
  async uploadQuotation(leadId: string, file: File, metadata: QuotationMetadata) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    const { data } = await api.post(ENDPOINTS.CRM.QUOTATIONS(leadId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Reminders
  async getReminders(params?: ReminderFilters) {
    const { data } = await api.get(ENDPOINTS.CRM.REMINDERS, { params });
    return data;
  },

  async createReminder(leadId: string, reminderData: CreateReminderDto) {
    const { data } = await api.post(ENDPOINTS.CRM.LEAD_REMINDERS(leadId), reminderData);
    return data;
  },

  async completeReminder(id: string) {
    const { data } = await api.patch(ENDPOINTS.CRM.COMPLETE_REMINDER(id));
    return data;
  },
};
```

---

## Type System

### Lead Types (`types/lead.ts`)

```typescript
export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  INTERESTED = 'INTERESTED',
  QUOTED = 'QUOTED',
  NEGOTIATING = 'NEGOTIATING',
  FOLLOW_UP_SCHEDULED = 'FOLLOW_UP_SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
  NOT_INTERESTED = 'NOT_INTERESTED',
}

export enum LeadPriority {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD',
}

export interface Lead {
  id: string;
  referenceNumber: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  fullName: string;
  email: string;
  phoneNumber?: string;
  destination?: string;
  travelStartDate?: string;
  travelEndDate?: string;
  numberOfTravelers?: number;
  assignedTo?: Admin;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  source: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  destination?: string;
  travelStartDate?: string;
  travelEndDate?: string;
  numberOfTravelers?: number;
  specialRequests?: string;
}
```

### Tour Types (`types/tour.ts`)

```typescript
export interface Tour {
  id: string;
  title: string;
  slug: string;
  metatitle?: string;
  metadesc?: string;
  overview?: string;
  description?: string;
  durationDays: number;
  durationNights: number;
  price: number;
  discountPrice?: number;
  images: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: TourItinerary[];
  cities: City[];
  themes: Theme[];
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TourItinerary {
  day: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface CreateTourDto {
  title: string;
  slug: string;
  description?: string;
  durationDays: number;
  durationNights: number;
  price: number;
  images: string[];
  itinerary: TourItinerary[];
  cityIds: string[];
  themeIds: string[];
}
```

---

## Setup Instructions

### Prerequisites

- **Node.js** v20 or higher
- **npm**

### Environment Variables

Create a `.env.local` file:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Installation Steps

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

3. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

### Available Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

---

## Development Workflows

### Adding a New Dashboard Page

1. **Create page** in `app/dashboard/`:

   ```typescript
   // app/dashboard/new-feature/page.tsx
   export default function NewFeaturePage() {
     return (
       <div className="p-6">
         <h1 className="text-2xl font-bold mb-4">New Feature</h1>
         {/* Content */}
       </div>
     );
   }
   ```

2. **Add to sidebar** in `components/dashboard/Sidebar.tsx`

### Creating a CRUD Interface

**Example: Managing Tags**

1. **Create service:**

   ```typescript
   // services/tag.service.ts
   export const tagService = {
     async getTags() {
       const { data } = await api.get('/api/admin/crm/tags');
       return data;
     },
     async createTag(tagData: CreateTagDto) {
       const { data } = await api.post('/api/admin/crm/tags', tagData);
       return data;
     },
     async updateTag(id: string, tagData: UpdateTagDto) {
       const { data } = await api.put(`/api/admin/crm/tags/${id}`, tagData);
       return data;
     },
     async deleteTag(id: string) {
       const { data } = await api.delete(`/api/admin/crm/tags/${id}`);
       return data;
     },
   };
   ```

2. **Create table component:**

   ```typescript
   // components/crm/TagTable.tsx
   'use client';

   import { useState, useEffect } from 'react';
   import { tagService } from '@/services/tag.service';
   import { DataTable } from '@/components/shared/DataTable';
   import { Button } from '@/components/ui/button';

   export function TagTable() {
     const [tags, setTags] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       loadTags();
     }, []);

     const loadTags = async () => {
       try {
         const data = await tagService.getTags();
         setTags(data);
       } finally {
         setLoading(false);
       }
     };

     const columns = [
       { key: 'name', label: 'Name' },
       { key: 'label', label: 'Label' },
       { key: 'color', label: 'Color' },
       {
         key: 'actions',
         label: 'Actions',
         render: (tag) => (
           <div className="flex gap-2">
             <Button onClick={() => handleEdit(tag)}>Edit</Button>
             <Button variant="destructive" onClick={() => handleDelete(tag.id)}>
               Delete
             </Button>
           </div>
         ),
       },
     ];

     return <DataTable columns={columns} data={tags} loading={loading} />;
   }
   ```

3. **Create dialog for create/edit:**

   ```typescript
   // components/crm/TagDialog.tsx
   'use client';

   import { useState } from 'react';
   import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
   import { Input } from '@/components/ui/input';
   import { Button } from '@/components/ui/button';
   import { tagService } from '@/services/tag.service';
   import { toast } from 'sonner';

   export function TagDialog({ open, onClose, tag, onSuccess }) {
     const [formData, setFormData] = useState(tag || { name: '', label: '', color: '#000000' });

     const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         if (tag) {
           await tagService.updateTag(tag.id, formData);
           toast.success('Tag updated successfully');
         } else {
           await tagService.createTag(formData);
           toast.success('Tag created successfully');
         }
         onSuccess();
         onClose();
       } catch (error) {
         toast.error('Failed to save tag');
       }
     };

     return (
       <Dialog open={open} onOpenChange={onClose}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>{tag ? 'Edit Tag' : 'Create Tag'}</DialogTitle>
           </DialogHeader>
           <form onSubmit={handleSubmit} className="space-y-4">
             <Input
               label="Name"
               value={formData.name}
               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
               required
             />
             <Input
               label="Label"
               value={formData.label}
               onChange={(e) => setFormData({ ...formData, label: e.target.value })}
               required
             />
             <Input
               type="color"
               label="Color"
               value={formData.color}
               onChange={(e) => setFormData({ ...formData, color: e.target.value })}
             />
             <Button type="submit">Save</Button>
           </form>
         </DialogContent>
       </Dialog>
     );
   }
   ```

### Using the Rich Text Editor

```typescript
'use client';

import { useState } from 'react';
import RichTextEditor from '@/components/shared/RichTextEditor';

export function ContentForm() {
  const [content, setContent] = useState('');

  return (
    <div>
      <RichTextEditor value={content} onChange={setContent} placeholder="Enter description..." />
    </div>
  );
}
```

### Working with Tables and Filters

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DataTable } from '@/components/shared/DataTable';

export function LeadList() {
  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
  });

  useEffect(() => {
    loadLeads();
  }, [filters]);

  const loadLeads = async () => {
    const data = await crmService.getLeads(filters);
    setLeads(data);
  };

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <Select
          value={filters.status}
          onChange={(value) => setFilters({ ...filters, status: value })}
          options={statusOptions}
        />
      </div>
      <DataTable columns={columns} data={leads} />
    </div>
  );
}
```

---

## Additional Notes

### Authentication

- Admin authentication required for all dashboard pages
- Token stored in localStorage
- Auto-redirect to login on 401 errors

### Permissions

- Role-based access control
- Module-level permissions checked on frontend and backend
- UI elements hidden based on permissions

### Toast Notifications

Use `sonner` for notifications:

```typescript
import { toast } from 'sonner';

toast.success('Operation successful');
toast.error('Operation failed');
toast.info('Information message');
```

### Dark Mode

- Supported via `next-themes`
- Toggle in user menu
- Persisted in localStorage

---

**For questions or issues, refer to the codebase or contact the development team.**
