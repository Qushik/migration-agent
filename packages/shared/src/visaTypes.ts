export type VisaStream = 'skilled' | 'employer_sponsored' | 'family' | 'student' | 'visitor' | 'refugee' | 'other';

export interface VisaSubclass {
  subclass: string;
  name: string;
  stream: VisaStream;
  type: 'temporary' | 'permanent';
  description: string;
  pros: string[];
  cons: string[];
  keyRequirements: string[];
  processingTimeDays?: { min: number; max: number };
  applicationCharge?: number;
  officialUrl: string;
}

export const VISA_SUBCLASSES: Record<string, VisaSubclass> = {
  '189': {
    subclass: '189',
    name: 'Skilled Independent',
    stream: 'skilled',
    type: 'permanent',
    description: 'Points-tested permanent residence visa for skilled workers with no employer or state sponsor.',
    pros: [
      'No employer or state sponsor required',
      'Live and work anywhere in Australia',
      'Pathway to citizenship',
      'Include family members',
    ],
    cons: [
      'Highly competitive — invitation cutoffs rising',
      'Occupation must be on MLTSSL',
      'Skills assessment required',
      'EOI scoring can take months to years',
    ],
    keyRequirements: [
      'Minimum 65 points on SkillSelect',
      'Age under 45 at time of invitation',
      'Occupation on MLTSSL',
      'Positive skills assessment',
      'Competent English (IELTS 6 overall, no band below 6)',
    ],
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189',
  },
  '190': {
    subclass: '190',
    name: 'Skilled Nominated',
    stream: 'skilled',
    type: 'permanent',
    description: 'Permanent residence visa for skilled workers nominated by a state or territory government.',
    pros: [
      '+5 points for state nomination',
      'Wider occupation list than 189',
      'More pathways available',
    ],
    cons: [
      'Must live in nominating state for 2 years',
      'State nomination is competitive and quota-limited',
      'Requirements vary widely by state',
    ],
    keyRequirements: [
      'Minimum 65 points (60 + 5 for nomination)',
      'State/territory nomination',
      'Occupation on relevant state list',
      'Competent English',
    ],
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190',
  },
  '482': {
    subclass: '482',
    name: 'Temporary Skill Shortage',
    stream: 'employer_sponsored',
    type: 'temporary',
    description: 'Employer-sponsored temporary work visa for skilled workers in genuine shortages.',
    pros: [
      'Pathway to PR via subclass 186',
      'Employer takes on much of the admin burden',
      'STSOL and MLTSSL occupations covered',
    ],
    cons: [
      'Tied to employer — must apply to change',
      'TSMIT salary floor ($79,423 from July 2026)',
      'Genuine position requirement increases refusal risk',
    ],
    keyRequirements: [
      'Approved sponsor employer',
      'Occupation on relevant list',
      'Salary at or above TSMIT ($79,423)',
      '2 years relevant work experience',
      'Functional English minimum',
    ],
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482',
  },
  '500': {
    subclass: '500',
    name: 'Student',
    stream: 'student',
    type: 'temporary',
    description: 'Temporary visa for full-time study at an Australian registered education provider.',
    pros: [
      'Work rights (48 hrs/fortnight during term)',
      'Pathway to post-study work visa (485)',
      'Bring eligible dependants (with restrictions from Sept 2026)',
    ],
    cons: [
      'Genuine Temporary Entrant (GTE) requirement rigorously assessed',
      'Dependant restrictions tightened September 2026',
      'Application charge increased to $2,500 (July 2026)',
      'No further stay conditions increasingly applied to overstayers',
    ],
    keyRequirements: [
      'Enrolment in registered course (CoE)',
      'GTE assessment',
      'Adequate financial capacity',
      'Health insurance (OSHC)',
      'English proficiency',
    ],
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
  },
  '820': {
    subclass: '820',
    name: 'Partner (Onshore)',
    stream: 'family',
    type: 'temporary',
    description: 'Temporary partner visa for those in genuine relationships with Australian citizens/PRs, applied onshore.',
    pros: [
      'Bridging visa A granted immediately on lodgement',
      'Work and study rights on bridging visa',
      'Automatic pathway to 801 (permanent)',
    ],
    cons: [
      'Long processing times (can exceed 2 years)',
      'Extensive relationship evidence required',
      'Separation or divorce during processing is high risk',
    ],
    keyRequirements: [
      'Genuine and ongoing relationship',
      'Sponsor must be Australian citizen, PR or eligible NZ citizen',
      'Joint financial, social, household evidence',
      'No character or health bar',
    ],
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-820-801',
  },
};
