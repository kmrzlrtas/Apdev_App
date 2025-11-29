# NutriTrackPH Design Guidelines

## Design Approach

**Selected Approach:** Design System (Material Design) + Health App References (MyFitnessPal, Cronometer, Lose It!)

**Rationale:** Nutrition tracking requires clear data hierarchy, intuitive forms, and efficient information display. Drawing from established health app patterns ensures learnability while Material Design provides robust components for data-heavy interfaces.

## Core Design Elements

### Typography

**Font Family:** Inter via Google Fonts CDN (excellent readability for data)

**Hierarchy:**
- Hero/Page Headers: text-4xl md:text-5xl font-bold
- Section Headers: text-2xl md:text-3xl font-semibold
- Card Titles: text-xl font-semibold
- Body Text: text-base font-normal
- Data Labels: text-sm font-medium
- Nutritional Values: text-lg font-semibold (numbers need prominence)
- Micro Info: text-xs font-normal

### Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 or p-6
- Section spacing: py-8 md:py-12
- Card gaps: gap-4 or gap-6
- Tight groupings: space-y-2
- Standard groupings: space-y-4

**Container Structure:**
- Max width: max-w-7xl mx-auto
- Dashboard grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Calendar view: Full-width with constrained inner content

### Component Library

#### Navigation
**Top Navigation Bar:**
- Sticky header with logo left, main nav center, user profile right
- Icons from Heroicons (outline style)
- Mobile: Hamburger menu transforming to sidebar
- Include quick stats badge (e.g., "Today: 1,450 cal")

#### Dashboard Layout
**Multi-Panel Structure:**
- Left sidebar (hidden on mobile): Quick add meal, daily summary stats
- Main content: 2-column grid on desktop, stacked on mobile
- Nutrition summary cards in grid-cols-1 md:grid-cols-4 showing macros
- Daily progress rings/charts below summary
- Recent meals list with expandable details

#### Calendar Interface
**Meal Calendar View:**
- Week view by default with day columns
- Each day divided into meal periods (Breakfast, Lunch, Dinner, Snacks)
- Compact meal entries showing thumbnail + name + quick calorie count
- Click to expand for full nutritional breakdown
- Add meal button prominent in each section
- Month view toggle showing daily calorie totals

#### Meal Logging
**AI-Powered Input Component:**
- Large text area with placeholder: "What did you eat? (e.g., 'chicken adobo with rice')"
- Submit button with loading spinner during AI processing
- Alternative: Quick add from recent/favorites list
- Portion size selector (sliders or increment buttons)
- Time picker for meal timing

#### Nutritional Display Cards
**Macro Breakdown Component:**
- Card layout with rounded-lg borders
- Progress bars for protein, carbs, fats with percentage filled
- Calorie count prominent at top
- Micronutrient accordion for vitamins/minerals
- Traffic light indicators (green/yellow/red) for daily targets

#### Recipe Suggestion Cards
**Grid Layout:**
- grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for recipe browsing
- Each card: Image (aspect-video), title, prep time, cost estimate
- Quick stats: servings, calories per serving
- "Budget-friendly" badge for affordable options
- Click reveals full recipe modal with ingredients and instructions

#### Educational Insights
**Tip Cards:**
- Daily rotating nutrition tip in banner format
- Icon + short headline + expandable description
- Contextual tips based on user's meal patterns
- "Learn More" linking to detailed articles

#### Data Visualization
**Charts and Graphs:**
- Weekly nutrition trends: Line chart showing daily calorie intake
- Macro distribution: Donut chart for protein/carbs/fats ratio
- Meal frequency: Bar chart for meal timing patterns
- Use chart.js via CDN for visualizations
- Responsive sizing: full width on mobile, constrained on desktop

### Forms and Inputs

**Input Fields:**
- Rounded corners (rounded-md)
- Clear labels above inputs
- Helper text below for guidance
- Error states with inline validation messages
- Focus states with subtle outline

**Button Styles:**
- Primary CTA: Large, rounded-lg, font-semibold
- Secondary: Outlined variant
- Icon buttons: Circular for compact actions
- Floating Action Button (FAB) for quick meal add (bottom-right on mobile)

### Modals and Overlays

**Meal Detail Modal:**
- Center-positioned, max-w-2xl
- Full nutritional breakdown table
- Edit/delete actions in footer
- Smooth fade-in animation

**Recipe View Modal:**
- Scrollable content with fixed header
- Image at top, ingredients list, step-by-step instructions
- "Add to Meal Log" button sticky at bottom

### Responsive Behavior

**Mobile-First Approach:**
- Stack all multi-column layouts on mobile
- Bottom navigation bar for core actions (Dashboard, Calendar, Recipes, Profile)
- Swipe gestures for calendar navigation
- Collapsible sections to reduce scrolling

**Desktop Enhancements:**
- Persistent sidebar navigation
- Hover states revealing quick actions
- Multi-panel dashboard view
- Larger chart visualizations

## Images

**Hero Section:** Full-width hero (h-[400px] md:h-[500px]) featuring vibrant Filipino healthy food spread - fresh vegetables, grilled proteins, colorful fruits. Overlay with welcome message and primary CTA "Start Tracking Your Meals".

**Recipe Cards:** Each recipe includes appetizing food photography (aspect-video ratio)

**Educational Content:** Infographic-style illustrations for nutrient guides

**Empty States:** Friendly illustrations when no meals logged (e.g., empty plate graphic)

## Accessibility

- Semantic HTML throughout (nav, main, article, aside)
- ARIA labels for all interactive elements
- Keyboard navigation support for calendar and forms
- High contrast for nutritional data readability
- Form inputs with associated labels and error announcements