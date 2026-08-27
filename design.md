# RoomieG Frontend Design

## Purpose
RoomieG is a roommate-finding application. The frontend journey is:

Registration → Login → Profile Completion → Feed → Like/Dislike → Connections → Chat.

The current React frontend is being migrated from the old User schema/API to the new profile-section architecture.

## Stack
- React
- React Router
- Redux
- Tailwind CSS
- DaisyUI

Use the existing stack. Do not introduce another state-management or UI framework without a strong reason.

## Current Routes
```text
/                         Feed
/login                    Login
/profile                  Profile
/connections              Connections
/requests                 Requests
/premium                  Premium
/chat/:targetUserId       Chat
```

Existing working functionality should be preserved during migration.

## Authentication & Access
After login:
```text
Login
 ↓
Current user
 ↓
Profile completion check
 ↓
Incomplete → Profile
Complete   → Feed
```

The frontend reflects backend authorization but is never the security boundary.

## Profile APIs
```http
GET   /profile/view
GET   /profile/completion

PATCH /profile/basic
PATCH /profile/occupation
PATCH /profile/location
PATCH /profile/lifestyle
PATCH /profile/housing
PATCH /profile/photo
PATCH /profile/preferences
PATCH /profile/privacy
PATCH /profile/password
```

Do not use the old generic `/profile/edit` architecture for the migrated profile.

## Profile Sections
```text
Basic
Occupation
Location
Photo
Lifestyle
Housing
Preferences
Privacy
Password
```

### Basic
- firstName
- lastName
- dateOfBirth
- gender
- bio
- languages

Age is calculated from `dateOfBirth`; do not store/display a separate persisted age.

### Occupation
```text
type: student | employed | self_employed | other
title
organization
```

For students, organization represents college/university. For employed users, it represents the company.

### Location
```text
city
area
state
country
coordinates
```

### Photo
RoomieG allows exactly one profile photo:
```text
photo.exactPhoto
photo.blurPhoto
```

The frontend renders the URL returned by the backend. It must not decide whether another user may see the exact photo.

### Lifestyle
```text
smoking
drinking
foodPreference
pets
sleepSchedule
cleanliness
workMode
guests
music
cooking
```

### Housing
```text
status
budget
moveInDate
preferredLocations
roomType
furnished
genderPreference
preferredAge
room
```

### Preferences
```text
notifications
```

### Privacy
```text
showLocation
```

## Form Saving Pattern
Do not save every field on `onBlur`.

Prefer:
```text
Basic       → Save
Occupation  → Save
Location    → Save
Lifestyle   → Save
Housing     → Save
Photo       → Save after upload
Preferences → Auto-save acceptable
Privacy     → Auto-save acceptable
Password    → Explicit save
```

Use local form state:
```text
Redux currentUser
      ↓
Local section form
      ↓
User edits
      ↓
Save
      ↓
PATCH section API
      ↓
Success
      ↓
Update Redux
```

Do not mutate the Redux user while the user is typing.

## Profile Completion
`profileCompleted` is backend-controlled.

Never send:
```json
{ "profileCompleted": true }
```

Use:
```http
GET /profile/completion
```

The backend determines completion and may return missing fields.

An incomplete profile cannot:
- access the feed
- like
- dislike

Frontend should redirect incomplete users to profile. Backend independently enforces the same rule.

If an API returns:
```text
403 PROFILE_INCOMPLETE
```
route the user to profile completion.

## Redux
Keep shared server/application state in Redux:
- currentUser
- authentication state
- profile completion state
- connections
- requests
- globally required chat state
- subscription state

Keep profile form fields local to components.

## API Layer
Keep HTTP calls outside UI components.

Preferred structure:
```text
src/
├── api/
│   ├── authApi.js
│   ├── profileApi.js
│   ├── connectionApi.js
│   ├── chatApi.js
│   └── paymentApi.js
├── components/
├── pages/
├── redux/
├── hooks/
└── utils/
```

Send only fields belonging to the endpoint:
```js
api.patch('/profile/basic', {
  firstName,
  lastName,
  dateOfBirth,
  gender,
  bio,
  languages,
});
```

Never send the entire Redux User object to a section endpoint.

## Protected Fields
Normal profile UI must not edit:
```text
isAdmin
accountStatus
isEmailVerified
subscription
profileCompleted
createdAt
updatedAt
lastLoginAt
lastActiveAt
```

## Data Migration
Map old concepts to the new model:
```text
age       → dateOfBirth
photoUrl  → photo.exactPhoto / photo.blurPhoto
about     → bio
company   → occupation.organization
```

Do not maintain duplicate old/new fields.

## Feed
Feed is available only after profile completion.

Preview cards should focus on roommate compatibility:
```text
Photo
Name + calculated age
Occupation
Location
Lifestyle highlights
Housing highlights
Like / Dislike
```

Keep preview concise; use a detail view for more information.

## Component Design
Prefer section components:
```text
Profile
├── BasicProfileForm
├── OccupationForm
├── LocationForm
├── PhotoForm
├── LifestyleForm
├── HousingForm
├── PreferencesForm
├── PrivacyForm
└── PasswordForm
```

Avoid one giant Profile component containing every form and API call.

## Route Guards
Conceptually:
```text
AuthenticatedRoute
  ├── not authenticated → /login
  └── authenticated
        ↓
ProfileCompletedRoute
  ├── incomplete → /profile
  └── complete → protected product routes
```

Route guards improve UX; backend authorization remains authoritative.

## UI
Use Tailwind for layout/spacing/responsive behavior and DaisyUI for common primitives:
- buttons
- inputs
- selects
- cards
- modals
- alerts
- badges
- tabs
- skeletons
- toasts

Design language:
```text
Clean
Friendly
Modern
Trustworthy
Simple
Privacy-conscious
```

Support mobile, tablet, and desktop.

## Loading / Saving / Errors
Every async action should have visible states:
```text
Idle → Saving... → Saved
```

Handle:
```text
400 → validation error
401 → authentication required
403 → forbidden / incomplete profile
404 → not found
500 → server error
```

Show user-friendly messages, not raw technical errors.

## Migration Principle
Do not blindly rewrite working pages.

Use:
```text
Read existing component
 ↓
Find old fields/API dependencies
 ↓
Map to new domain
 ↓
Update local state
 ↓
Update API payload
 ↓
Update Redux synchronization
 ↓
Test affected flow
```

## Golden Rule
Build the frontend around RoomieG user journeys and domain sections, not raw database fields.

Backend owns validation, authorization, profile completion, subscription state, and privacy rules.

Frontend owns presentation, local form state, navigation, loading states, error display, and UX.
