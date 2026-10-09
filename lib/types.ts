export const DOMAINS = ['Web Development','Design','Logistics','Operations','Sponsorship','Hospitality','Social Media','Event Management'] as const;
export const POSITIONS = ['Head','Vice-Head','Core Member','Member'] as const;
export const BRANCHES = ['CSE','AIML','ECE','EEE','ME','Biotech','Civil','Other'] as const;
export type MemberStatus = 'pending' | 'approved' | 'rejected';
export type Member = {
  id: string; name: string; domain: string; position: string; srn: string; email: string;
  linkedin_url: string | null; github_url: string | null; branch: string; semester: number;
  bio: string | null; photo_url: string; status: MemberStatus; created_at: string;
};
