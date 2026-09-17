// ============================================================
// Australian Visa Subclass Reference Data
// Source: Department of Home Affairs (as at September 2026)
// ============================================================

import type { VisaPathway } from './types';

export const VISA_PATHWAYS: VisaPathway[] = [
  {
    subclass: '189',
    name: 'Skilled Independent Visa',
    category: 'skilled-independent',
    processingTime: '6–12 months',
    cost: 4770,
    pros: [
      'Permanent residence from day one',
      'No employer sponsorship required',
      'Unlimited re-entry rights',
      'Full work and study rights',
      'Path to Australian citizenship after 4 years PR',
    ],
    cons: [
      'Highly competitive — requires high points score (typically 90+)',
      'Occupation must be on MLTSSL',
      'Skills assessment can take 3–6 months and cost $500–$1,500',
      'No guarantee of invitation — based on pool ranking',
    ],
    eligibilityRequirements: [
      'Nominated occupation on MLTSSL',
      'Skills assessment from relevant assessing body',
      'Minimum 65 points (invitation typically requires 90+)',
      'Age under 45 at time of invitation',
      'Competent English (IELTS 6.0 each band or equivalent)',
      'Must not have had visa refused since last SkillSelect EOI',
    ],
    leadsToPR: true,
    currentDemand: 'very-high',
  },
  {
    subclass: '190',
    name: 'Skilled Nominated Visa',
    category: 'skilled-independent',
    processingTime: '6–14 months',
    cost: 4770,
    pros: [
      'Permanent residence',
      '5 extra points for state/territory nomination',
      'More occupations eligible than 189',
      'State-specific occupation lists can open options closed at federal level',
    ],
    cons: [
      'Must live and work in nominating state for at least 2 years',
      'State nomination quotas fill quickly — timing critical',
      'Each state has its own requirements and skills shortages list',
      'Nomination is not guaranteed even if occupation is listed',
    ],
    eligibilityRequirements: [
      'Invitation from a state or territory government',
      'Occupation on state nomination list',
      'Skills assessment',
      'Minimum 65 points (+ 5 from nomination)',
      'Age under 45 at invitation',
      'Competent English',
    ],
    leadsToPR: true,
    currentDemand: 'high',
  },
  {
    subclass: '482',
    name: 'Temporary Skill Shortage (TSS) Visa',
    category: 'employer-sponsored',
    processingTime: '1–4 months',
    cost: 3115,
    pros: [
      'Faster processing than permanent pathways',
      'Employer pays nomination charge',
      'Short-term stream for hard-to-fill roles',
      'Medium-term stream can lead to 186 PR after 3 years',
      'Can bring dependants',
    ],
    cons: [
      'Tied to sponsoring employer — changing jobs requires new nomination',
      'TSMIT now $79,423 as at July 2026',
      'Short-term stream does NOT lead to PR',
      'Employer must be approved sponsor',
      'Labour market testing usually required',
    ],
    eligibilityRequirements: [
      'Approved Standard Business Sponsor',
      'Occupation on MLTSSL (medium-term) or STSOL (short-term)',
      'Salary at or above TSMIT ($79,423 from July 2026)',
      'Skills and qualifications for the role',
      'Labour market testing (unless exempt)',
    ],
    leadsToPR: false,
    currentDemand: 'high',
    annualCap: 58040,
  },
  {
    subclass: '186',
    name: 'Employer Nomination Scheme (ENS)',
    category: 'employer-sponsored',
    processingTime: '6–18 months',
    cost: 4770,
    pros: [
      'Permanent residence',
      'Transition stream available for 482 holders after 3 years',
      'Direct Entry stream for highly skilled applicants',
      'Employer commitment signals genuine employment',
    ],
    cons: [
      'Long processing times for Direct Entry stream',
      'Employer must demonstrate need',
      'Occupation restrictions',
      'High salary threshold',
    ],
    eligibilityRequirements: [
      'Employer nomination by approved sponsor',
      'Occupation on relevant list',
      'Skills assessment (Direct Entry) or 3 years 482 experience (Transition)',
      'Age under 45',
      'Competent English',
      'Salary at market rate',
    ],
    leadsToPR: true,
    currentDemand: 'moderate',
  },
  {
    subclass: '500',
    name: 'Student Visa',
    category: 'student',
    processingTime: '1–3 months',
    cost: 2500,
    pros: [
      'Study full-time at Australian institutions',
      'Work rights (48 hours/fortnight during term)',
      'Dependants may study and work',
      'Can transition to Graduate visa (485)',
    ],
    cons: [
      'Visa application charge increased to $2,500 from July 2026',
      'Dependant rights significantly restricted for many students from 2026',
      'Must maintain enrolment and satisfactory attendance',
      'Overstay enforcement dramatically increased in 2026',
      'Health Insurance (OSHC) mandatory',
    ],
    eligibilityRequirements: [
      'Confirmation of Enrolment (CoE) from registered CRICOS provider',
      'Genuine Temporary Entrant (GTE) requirement',
      'English proficiency (IELTS 5.5+ typically)',
      'OSHC health cover',
      'Financial capacity to support study and living costs',
    ],
    leadsToPR: false,
    currentDemand: 'high',
  },
  {
    subclass: '600',
    name: 'Visitor Visa',
    category: 'visitor',
    processingTime: '1 day – 4 weeks',
    cost: 190,
    pros: [
      'Low cost',
      'Fast processing',
      'Suitable for tourism, family visits, business meetings',
    ],
    cons: [
      'Cannot work',
      'Extensions difficult — "no further stay" conditions increasingly applied in 2026',
      'Not a pathway to permanent residence',
      'Strong overstay enforcement as at September 2026',
    ],
    eligibilityRequirements: [
      'Genuine visitor intent',
      'Sufficient funds for the visit',
      'Strong ties to home country',
      'Good health and character',
    ],
    leadsToPR: false,
    currentDemand: 'moderate',
  },
  {
    subclass: '820/801',
    name: 'Partner Visa (Temporary/Permanent)',
    category: 'family',
    processingTime: '24–36 months',
    cost: 8850,
    pros: [
      'Full work and study rights on 820',
      'Leads to permanent residence (801)',
      'Covers de facto and married partners',
    ],
    cons: [
      'Very long processing times',
      'High application charge',
      'Must prove genuine relationship with extensive evidence',
      'Two-stage process — wait period on 820 before 801 granted',
    ],
    eligibilityRequirements: [
      'Sponsor is Australian citizen, PR, or eligible NZ citizen',
      'Genuine de facto or married relationship',
      'Must have been in relationship for 12 months (de facto)',
      'Health and character requirements',
    ],
    leadsToPR: true,
    currentDemand: 'high',
  },
];

export const VISA_BY_SUBCLASS = Object.fromEntries(
  VISA_PATHWAYS.map((v) => [v.subclass, v]),
);

// 2026–27 Program Settings (Home Affairs)
export const PROGRAM_SETTINGS_2026_27 = {
  totalPermanentPlaces: 185000,
  skilledMigration: 130200,
  familyMigration: 54800,
  specialEligibility: 1000,
  employerSponsored: 58040,
  tsmit: 79423,           // Temporary Skilled Migration Income Threshold (from 1 July 2026)
  studentVisaCharge: 2500, // From 1 July 2026
  programYear: '2026-27',
  source: 'Department of Home Affairs',
  lastUpdated: '2026-07-01',
};
