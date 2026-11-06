// Time formatting for chat bubbles (e.g., "10:30 AM")
export const formatMessageTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

// WhatsApp-style date separators in chat body (e.g., "Today", "Yesterday", "Monday", "2 November 2026")
export const formatMessageDateSeparator = (dateString) => {
  if (!dateString) return "";
  try {
    const msgDate = new Date(dateString);
    if (isNaN(msgDate.getTime())) return "";

    const now = new Date();

    // Reset times to midnight for accurate day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());

    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    if (diffDays > 1 && diffDays < 7) {
      // Day name (e.g. "Monday", "Wednesday")
      return msgDate.toLocaleDateString([], { weekday: "long" });
    }

    // Older than 6 days: "2 November" or "2 November 2025"
    if (msgDate.getFullYear() === now.getFullYear()) {
      return msgDate.toLocaleDateString([], {
        day: "numeric",
        month: "long",
      });
    }

    return msgDate.toLocaleDateString([], {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

// WhatsApp-style time/date for left sidebar conversation list (e.g. "10:30 AM", "Yesterday", "Mon", "04/11/26")
export const formatConversationTime = (dateString) => {
  if (!dateString) return "";
  try {
    const msgDate = new Date(dateString);
    if (isNaN(msgDate.getTime())) return "";

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());

    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return msgDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    if (diffDays > 1 && diffDays < 7) {
      return msgDate.toLocaleDateString([], { weekday: "short" });
    }

    // Older dates: DD/MM/YYYY
    return msgDate.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  } catch {
    return "";
  }
};
