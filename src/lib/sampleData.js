import { offsetDate } from './logic'

// Builds sample decisions with dates relative to today, so overdue / upcoming
// reviews always stay meaningful. `createdAt` is spaced out so "recent" works.
export function buildSampleData() {
  const now = Date.now()
  const day = 86400000

  const mk = (i, daysAgo, reviewIn, rest, review = null) => ({
    id: `sample_${i}`,
    decisionDate: offsetDate(-daysAgo),
    reviewDate: offsetDate(reviewIn),
    createdAt: now - daysAgo * day,
    review,
    ...rest,
  })

  const rev = (daysAgo, rating, actualOutcome, lessons, again) => ({
    reviewedOn: offsetDate(-daysAgo),
    rating,
    actualOutcome,
    lessons,
    again,
  })

  return [
    // ---------- Reviewed ----------
    mk(1, 120, -60, {
      title: 'Subscribe to a premium AI assistant',
      category: 'Technology',
      description: 'Pay for the Pro tier of an AI assistant instead of using the free plan.',
      reason: 'Free tier limits were interrupting my workflow several times a week.',
      expectedOutcome: 'Save about 3 hours a week on drafting and research tasks.',
      confidence: 80,
    }, rev(58, 'Better Than Expected',
      'Saving closer to 5 hours a week. Also started using it for meeting preparation and summaries.',
      'Measure the benefit after one month, not just by gut feel. Paid tools get used more than free ones.',
      'Yes')),

    mk(2, 150, -90, {
      title: 'Attend a professional development course',
      category: 'Learning',
      description: 'Enrol in a 6-week evening course on data storytelling.',
      reason: 'I wanted a structured way to improve how I present data to stakeholders.',
      expectedOutcome: 'Confidently deliver one data-driven presentation to leadership.',
      confidence: 70,
    }, rev(85, 'As Expected',
      'Completed the course and delivered a leadership presentation that landed well.',
      'Structured deadlines worked better than self-study. Two evenings a week was sustainable.',
      'Yes')),

    mk(3, 100, -40, {
      title: 'Purchase a new laptop',
      category: 'Technology',
      description: 'Replace my 5-year-old laptop with a newer ultrabook.',
      reason: 'Battery life had dropped under 2 hours and builds were getting slow.',
      expectedOutcome: 'Faster builds and a full working day on battery.',
      confidence: 85,
    }, rev(38, 'Better Than Expected',
      'Builds are 3x faster and battery easily lasts a full day. Lighter to carry too.',
      'I should have upgraded earlier. Slow equipment had a hidden productivity cost.',
      'Yes')),

    mk(4, 90, -30, {
      title: 'Switch mobile service provider',
      category: 'Finance',
      description: 'Move from my current telco to a cheaper SIM-only plan.',
      reason: 'The new plan offered the same data for about 40% less.',
      expectedOutcome: 'Save around $25 a month with no drop in coverage.',
      confidence: 60,
    }, rev(28, 'Worse Than Expected',
      'Saved money, but coverage at home is patchy and calls drop on my commute.',
      'Check coverage at the places I actually spend time before switching. Price was not the only factor.',
      'No')),

    mk(5, 75, -20, {
      title: 'Adopt a new productivity app',
      category: 'Technology',
      description: 'Move task management from notebooks to a dedicated app.',
      reason: 'Tasks were getting lost across several paper lists.',
      expectedOutcome: 'Never miss a deadline and clear the weekly backlog.',
      confidence: 55,
    }, rev(18, 'As Expected',
      'Fewer missed tasks, though I still keep a paper list for daily priorities.',
      'Tools help, but the habit of a weekly review matters more than the app itself.',
      'Unsure')),

    mk(6, 60, -10, {
      title: 'Start a morning exercise routine',
      category: 'Personal',
      description: 'Exercise for 30 minutes at 6:30am, four days a week.',
      reason: 'My energy dipped badly in the afternoons and I was sitting too much.',
      expectedOutcome: 'More energy and a consistent four sessions a week.',
      confidence: 50,
    }, rev(8, 'Worse Than Expected',
      'Managed about two sessions a week. Early starts hurt my sleep on busy days.',
      'Overestimated my consistency. A smaller, flexible target would have been smarter.',
      'Unsure')),

    mk(7, 55, -5, {
      title: 'Join a professional networking group',
      category: 'Career',
      description: 'Become a member of a local industry meetup group.',
      reason: 'I wanted to meet people outside my own company and hear about opportunities.',
      expectedOutcome: 'Make 3 useful contacts within a quarter.',
      confidence: 65,
    }, rev(3, 'As Expected',
      'Met 3 useful contacts and was invited to speak at one event.',
      'Showing up consistently mattered more than any single event.',
      'Yes')),

    // ---------- Review due / overdue ----------
    mk(8, 45, -12, {
      title: 'Invest in a professional certification',
      category: 'Career',
      description: 'Pay for exam fees and a prep course for a project management certification.',
      reason: 'It is increasingly listed in the roles I am interested in.',
      expectedOutcome: 'Pass the exam on the first attempt and become eligible for senior roles.',
      confidence: 75,
    }),

    mk(9, 40, -6, {
      title: 'Outsource bookkeeping to a service',
      category: 'Finance',
      description: 'Hand over monthly bookkeeping to an online accounting service.',
      reason: 'I was spending 6+ hours a month on admin I did not enjoy.',
      expectedOutcome: 'Reclaim 6 hours a month with accurate books at a fair cost.',
      confidence: 70,
    }),

    mk(10, 30, 0, {
      title: 'Change my daily work routine',
      category: 'Personal',
      description: 'Block 9am-11am for deep work and move meetings to the afternoon.',
      reason: 'Constant interruptions meant I rarely finished important work.',
      expectedOutcome: 'Complete at least one major task per day before lunch.',
      confidence: 65,
    }),

    // ---------- Awaiting review ----------
    mk(11, 20, 14, {
      title: 'Upgrade a software subscription',
      category: 'Technology',
      description: 'Move our design tool from the Starter plan to the Team plan.',
      reason: 'We needed shared libraries and version history for client projects.',
      expectedOutcome: 'Cut design handover time in half and reduce rework.',
      confidence: 80,
    }),

    mk(12, 14, 30, {
      title: 'Book a family holiday',
      category: 'Personal',
      description: 'Book a week-long family trip for the next school break.',
      reason: 'We have not had a proper break together in over two years.',
      expectedOutcome: 'A relaxed week with no work calls, within budget.',
      confidence: 90,
    }),

    mk(13, 8, 45, {
      title: 'Move emergency savings to a high-yield account',
      category: 'Finance',
      description: 'Shift 6 months of expenses to a higher-interest savings account.',
      reason: 'The current account pays almost nothing in interest.',
      expectedOutcome: 'Earn about $400 more per year with the same access to funds.',
      confidence: 85,
    }),

    mk(14, 3, 60, {
      title: 'Take a part-time evening MBA module',
      category: 'Learning',
      description: 'Enrol in one evening module to test the commitment before a full programme.',
      reason: 'I want to know if a full MBA suits me before committing money and time.',
      expectedOutcome: 'Finish the module with a B+ while keeping up with work.',
      confidence: 45,
    }),

    mk(15, 1, 21, {
      title: 'Take on a stretch project at work',
      category: 'Career',
      description: 'Volunteer to lead the regional analytics rollout.',
      reason: 'It is high visibility and builds management experience.',
      expectedOutcome: 'Deliver on time and be considered for a team lead role.',
      confidence: 60,
    }),
  ]
}
