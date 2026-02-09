export interface Profile {
  id: string;
  country?: string;
  city?: string;
  phone?: string;
  full_name: string;
  email: string;
}

export interface TravelerProfile {
  id: string;
  full_name: string;
  email: string;
  avatar?: string;
  use_id?: string;            
  profiles?: Profile;        
}

export interface Shoutout {
  id: string;
  author_id: string;          
  title: string;
  content: string;
  tags: string[];             
  created_at?: string;        
  updated_at?: string;
  profiles?: TravelerProfile;  
}

export type ShoutoutList = Shoutout[];
