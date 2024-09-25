type Attachment = {
  filename: string;
  url: string;
  content_type: string;
  size: number;
  metadata: {
    is_inline: boolean;
    cid: string;
  }
}


export interface FrontMessage {
  _links: {
    self: string;
    related: {
      conversation: string | null;
      message_seen: string | null;
    };
  };
  id: string;
  type: string;
  is_inbound: boolean;
  created_at: number;
  blurb: string;
  body: string;
  text: string;
  error_type: string | null;
  version: string;
  subject: string | null;
  draft_mode: string | null;
  metadata: {
    headers: {
      in_reply_to: string | null;
    };
  };
  author: {
    _links: {
      self: string;
      related: {
        inboxes: string | null;
        conversations: string | null;
      };
    };
    id: string;
    email: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    is_admin: boolean;
    is_available: boolean;
    is_blocked: boolean;
    custom_fields: {
      [key: string]: string | boolean | number;
    };
  };
  recipients: Array<{
    _links: {
      related: {
        contact: string | null;
      };
    };
    name: string | null;
    handle: string;
    role: string;
  }>;
  attachments: Array<Attachment>
  signature: string | null;
  is_draft: boolean;
}

