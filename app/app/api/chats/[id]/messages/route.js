import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(req, { params }) {
  // Support both cookie-based sessions (web) and Bearer JWTs (mobile)
  const session = await getSession(req);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session.user.id);
  const conversationId = parseInt(params.id);

  try {
    // Verify participation
    const participation = await sql`
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = ${conversationId} AND user_id = ${userId}
    `;

    if (participation.length === 0) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update last read time
    await sql`
      UPDATE conversation_participants 
      SET last_read_at = NOW() 
      WHERE conversation_id = ${conversationId} AND user_id = ${userId}
    `;

    // Fetch messages
    const messages = await sql`
      SELECT 
        m.id, 
        m.content, 
        m.created_at, 
        m.sender_id,
        u.name as sender_name,
        u.image as sender_avatar
      FROM messages m
      JOIN auth_users u ON m.sender_id = u.id
      WHERE m.conversation_id = ${conversationId}
      ORDER BY m.created_at ASC
    `;

    return Response.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(req, { params }) {
  // Support both cookie-based sessions (web) and Bearer JWTs (mobile)
  const session = await getSession(req);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session.user.id);
  const conversationId = parseInt(params.id);
  const { content } = await req.json();

  if (!content || !content.trim()) {
    return Response.json({ error: "Message cannot be empty" }, { status: 400 });
  }

  try {
    // Verify participation
    const participation = await sql`
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = ${conversationId} AND user_id = ${userId}
    `;

    if (participation.length === 0) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Insert message
    const [newMessage] = await sql`
      INSERT INTO messages (conversation_id, sender_id, content, created_at)
      VALUES (${conversationId}, ${userId}, ${content}, NOW())
      RETURNING id, content, created_at, sender_id
    `;

    // Update conversation timestamp
    await sql`
      UPDATE conversations 
      SET updated_at = NOW() 
      WHERE id = ${conversationId}
    `;

    return Response.json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
