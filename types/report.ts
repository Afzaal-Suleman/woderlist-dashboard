export type ReportEntityType =
    | 'user'
    | 'agency'
    | 'trip'
    | 'review'
    | 'booking';

export type ReportReason =
    | 'spam'
    | 'fraud'
    | 'harassment'
    | 'fake_information'
    | 'inappropriate_content'
    | 'scam'
    | 'other';

export type ReportStatus =
    | 'pending'
    | 'reviewing'
    | 'resolved'
    | 'rejected';

export type Report = {
    id: string; // uuid
    reporter_id: string; // uuid
    reporter_type: 'traveler' | 'agency';

    entity_type: ReportEntityType;
    entity_id: string; // uuid

    reason: ReportReason;
    description: string | null;

    status: ReportStatus;
    admin_notes: string | null;

    reviewed_by: string | null; // uuid
    reviewed_at: string | null; // ISO timestamp

    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
};
