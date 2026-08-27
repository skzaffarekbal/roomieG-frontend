# RoomieG Frontend AGENTS.md

## Mission
Maintain and migrate the existing RoomieG React frontend from the old User schema/API to the new profile-section architecture without breaking working functionality.

## Stack
- React
- React Router
- Redux
- Tailwind CSS
- DaisyUI

Do not introduce another frontend framework, state-management library, or UI library without explicit approval.

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

Preserve existing working route behavior during migration.

## New User Domain
```text
age       → dateOfBirth
photoUrl  → photo.exactPhoto / photo.blurPhoto
about     → bio
company   → occupation.organization
```

Do not maintain duplicate old/new fields. Age is calculated from `dateOfBirth`.

## Registration
Registration remains intentionally simple:
```text
firstName
lastName
emailId
password
```

Do not require all profile data during registration.

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

Do not reintroduce the old unrestricted `/profile/edit` approach.

## Profile Completion
`profileCompleted` is backend-controlled.

Never send:
```js
{ profileCompleted: true }
```

An incomplete profile cannot:
- access the feed
- like
- dislike

If the backend returns `403 PROFILE_INCOMPLETE`, route the user to profile completion. Frontend hiding/disablement is UX only; backend authorization is authoritative.

## Profile Forms
Use local state per section:
```text
Redux currentUser
      ↓
local section state
      ↓
edit
      ↓
save
      ↓
PATCH API
      ↓
update Redux after success
```

Do not put every form field in Redux or mutate the Redux user while typing.

## Save Strategy
```text
Basic       → Save
Occupation  → Save
Location    → Save
Lifestyle   → Save
Housing     → Save
Photo       → after upload
Preferences → auto-save acceptable
Privacy     → auto-save acceptable
Password    → explicit save
```

Avoid API writes on every `onBlur`.

## API Payload Discipline
Never send the entire Redux User object to a section endpoint.

Correct:
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

Each request must contain only fields belonging to that endpoint.

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

## Photo
RoomieG allows exactly one profile photo:
```text
photo.exactPhoto
photo.blurPhoto
```

Do not build a multi-photo gallery. Do not decide photo authorization in React; render the URL returned by the backend.

## Occupation
Use:
```text
student
employed
self_employed
other
```

Shared model:
```text
occupation.type
occupation.title
occupation.organization
```

For students, organization represents college/university. For employed users, it represents company.

## API Layer
Keep HTTP calls outside UI components. Prefer:
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

## Components
Prefer section components:
```text
BasicProfileForm
OccupationForm
LocationForm
PhotoForm
LifestyleForm
HousingForm
PreferencesForm
PrivacyForm
PasswordForm
```

Avoid one giant Profile component containing every form and API call.

## Redux
Use Redux for shared server/application state:
```text
currentUser
auth
profile completion
connections
requests
chat where globally required
subscription
```

Use local React state for forms.

## Routing
Use route guards conceptually:
```text
AuthenticatedRoute
  ↓
ProfileCompletedRoute
```

Unauthenticated users go to `/login`; authenticated users with incomplete profiles go to `/profile`; completed users can access protected product routes.

## Feed
Feed requires profile completion.

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

Keep preview concise; use detail views for additional information.

## Styling
Use Tailwind CSS for layout, spacing, and responsive behavior. Use DaisyUI for common primitives. Do not add another UI library.

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

## Async UX
Show clear states:
```text
Loading
Saving
Saved
Error
```

Use DaisyUI skeletons, alerts, and toasts where appropriate.

## Error Handling
```text
400 → validation
401 → authentication
403 → forbidden / profile incomplete
404 → not found
500 → server error
```

Show user-friendly messages; never expose raw stack traces.

## Migration Workflow
Before changing an existing component:
1. Read the component.
2. Find API calls.
3. Find Redux dependencies.
4. Find old User fields.
5. Map them to the new model.
6. Update local form state.
7. Update API payload.
8. Update Redux synchronization.
9. Test the affected flow.

Do not blindly rewrite working functionality.

## Testing Checklist
```text
□ Registration
□ Login
□ Profile load
□ Basic save
□ Occupation save
□ Location save
□ Lifestyle save
□ Housing save
□ Photo upload
□ Preferences
□ Privacy
□ Password change
□ Profile completion
□ Incomplete profile blocked from feed
□ Incomplete profile blocked from like
□ Incomplete profile blocked from dislike
□ Completed profile can access feed
□ Completed profile can like/dislike
□ Connections still work
□ Requests still work
□ Chat still works
□ Premium still works
```

## Golden Rule
Preserve working behavior first, then improve architecture.

Build around RoomieG user journeys and domain sections, not raw database fields.
